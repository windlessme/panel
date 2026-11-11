import { type UpdateStatus, useUpdateStatus } from '@/features/updates/api.ts'
import { cn } from '@/utils'
import {
    IconAlertTriangle,
    IconCheck,
    IconCircleArrowUp,
    IconDatabaseExclamation,
    IconDisc,
    IconNetwork,
    IconPlayerPause,
    IconServerBolt,
    IconUserPlus,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ReactNode } from 'react'

import { t } from '@/lib/i18n.ts'
import { TablerIcon } from '@/lib/tabler.ts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SimpleEmptyState } from '@/components/ui/EmptyStates'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    OverflowItemGroup,
} from '@/components/ui/Item'

import { bytes, num } from './overview-helpers'

type OverviewData = App.Data.Admin.Overview.OverviewData

/** Cap so the card never grows or shifts the page; overflow opens the sheet. */
const MAX_VISIBLE = 4

type ItemTone = 'alert' | 'neutral' | 'setup'

interface AttentionItem {
    id: string
    tone: ItemTone
    icon: TablerIcon
    title: string
    description: string
    action: ReactNode
}

const iconWrapClass: Record<ItemTone, string> = {
    alert: 'bg-destructive/10 text-destructive',
    neutral: 'bg-muted text-foreground',
    setup: 'bg-primary/10 text-primary',
}

const ActionLink = ({ to, children }: { to: string; children: ReactNode }) => (
    <Link
        to={to}
        className='text-primary ml-auto shrink-0 text-sm font-semibold hover:underline'
    >
        {children}
    </Link>
)

const AttentionRow = ({ item }: { item: AttentionItem }) => {
    const Icon = item.icon
    return (
        <Item variant='muted' size='sm'>
            <ItemMedia>
                <span
                    className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg',
                        iconWrapClass[item.tone]
                    )}
                >
                    <Icon className='size-4' />
                </span>
            </ItemMedia>
            <ItemContent className='min-w-0'>
                {/* ItemTitle is a `w-fit` flex row, so the ellipsis has to live
                    on a child that can actually shrink. */}
                <ItemTitle className='w-full min-w-0'>
                    <span className='truncate'>{item.title}</span>
                </ItemTitle>
                <ItemDescription className='block truncate text-xs text-nowrap'>
                    {item.description}
                </ItemDescription>
            </ItemContent>
            <ItemActions className='shrink-0'>{item.action}</ItemActions>
        </Item>
    )
}

/** Real problems worth surfacing, most-severe first. Empty when all is well. */
const deriveAttention = (
    data: OverviewData,
    update: UpdateStatus | undefined
): AttentionItem[] => {
    const { summary, servers, backups, nodes } = data
    const items: AttentionItem[] = []

    if (summary.failedServers > 0) {
        items.push({
            id: 'failed-servers',
            tone: 'alert',
            icon: IconAlertTriangle,
            title: `${num(summary.failedServers)} server${summary.failedServers === 1 ? '' : 's'} failed to install`,
            description: t('Review provisioning logs on the affected nodes.'),
            action: <ActionLink to='/admin/servers'>{t('Review')}</ActionLink>,
        })
    }

    if (summary.flaggedClusters > 0) {
        items.push({
            id: 'flagged-clusters',
            tone: 'alert',
            icon: IconNetwork,
            title: `${num(summary.flaggedClusters)} cluster identit${summary.flaggedClusters === 1 ? 'y' : 'ies'} flagged`,
            description: t(
                'A cluster reported members that share nothing with what Convoy recorded.'
            ),
            action: <ActionLink to='/admin/nodes'>{t('Review')}</ActionLink>,
        })
    }

    if (servers.flagged > 0) {
        items.push({
            id: 'flagged-servers',
            tone: 'alert',
            icon: IconAlertTriangle,
            title: `${num(servers.flagged)} server${servers.flagged === 1 ? '' : 's'} flagged`,
            description: t(
                'Placement could not be reconciled automatically — a guest moved somewhere Convoy cannot follow.'
            ),
            action: <ActionLink to='/admin/servers'>{t('Review')}</ActionLink>,
        })
    }

    if (backups.failed > 0) {
        items.push({
            id: 'failed-backups',
            tone: 'alert',
            icon: IconDatabaseExclamation,
            title: `${num(backups.failed)} backup${backups.failed === 1 ? '' : 's'} failed`,
            description: t('Backups that did not complete successfully.'),
            action: <ActionLink to='/admin/servers'>{t('View')}</ActionLink>,
        })
    }

    // Below the outright failures above: a panel a release behind is worth
    // knowing about, but it is not broken the way a failed install is.
    if (update?.updateAvailable) {
        items.push({
            id: 'update-available',
            tone: 'neutral',
            icon: IconCircleArrowUp,
            title: t('Convoy {{latestVersion}} is available', {
                latestVersion: update.latestVersion,
            }),
            description: t('This panel is running {{currentVersion}}.', {
                currentVersion: update.currentVersion,
            }),
            action: (
                <ActionLink to='/admin/settings/updates'>
                    {t('View')}
                </ActionLink>
            ),
        })
    }

    nodes
        .filter(node => node.memory.percent >= 90)
        .forEach(node => {
            items.push({
                id: `node-capacity-${node.id}`,
                tone: 'neutral',
                icon: IconServerBolt,
                title: t('{{displayName}} near memory capacity', {
                    displayName: node.displayName,
                }),
                description: t('Allocated {{percent}}% of {{total}}.', {
                    percent: node.memory.percent,
                    total: bytes(node.memory.total),
                }),
                action: <ActionLink to='/admin/nodes'>{t('View')}</ActionLink>,
            })
        })

    if (servers.suspended > 0) {
        items.push({
            id: 'suspended-servers',
            tone: 'neutral',
            icon: IconPlayerPause,
            title: `${num(servers.suspended)} server${servers.suspended === 1 ? '' : 's'} suspended`,
            description: t('Suspended servers are not running.'),
            action: <ActionLink to='/admin/servers'>{t('View')}</ActionLink>,
        })
    }

    return items
}

/** Onboarding checklist shown on a fresh install instead of a wall of zeros. */
const deriveSetup = (data: OverviewData): AttentionItem[] => [
    {
        id: 'setup-node',
        tone: 'setup',
        icon: IconServerBolt,
        title: t('Add another node'),
        description: t('You have {{num}}. More nodes, more capacity.', {
            num: num(data.summary.nodes),
        }),
        action: <ActionLink to='/admin/nodes'>{t('Add node')}</ActionLink>,
    },
    {
        id: 'setup-ip',
        tone: 'setup',
        icon: IconNetwork,
        title: t('Create an IP pool'),
        description: t('Servers need addresses to come online.'),
        action: <ActionLink to='/admin/ipam'>{t('New pool')}</ActionLink>,
    },
    {
        id: 'setup-iso',
        tone: 'setup',
        icon: IconDisc,
        title: t('Upload an ISO'),
        description: t('Give users something to install from.'),
        action: <ActionLink to='/admin/nodes'>{t('Add ISO')}</ActionLink>,
    },
    {
        id: 'setup-team',
        tone: 'setup',
        icon: IconUserPlus,
        title: t('Invite your team'),
        description: t('Add admins and give them access.'),
        action: <ActionLink to='/admin/servers'>{t('Invite')}</ActionLink>,
    },
]

interface Props {
    data: OverviewData
    /** Fresh install → onboarding checklist instead of alerts. */
    isFresh: boolean
}

const NeedsAttentionCard = ({ data, isFresh }: Props) => {
    // Shares its query with the rest of the dashboard, so this costs no extra
    // request. A fresh install is walking through setup, not chasing releases,
    // so the update only surfaces in the attention list.
    const { data: update } = useUpdateStatus()

    const items = isFresh ? deriveSetup(data) : deriveAttention(data, update)
    const title = isFresh ? 'Finish setup' : 'Needs attention'

    return (
        <Card className='flex flex-col'>
            <CardHeader className='p-5 pb-2'>
                <CardTitle className='text-base'>{title}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-1 flex-col p-5 pt-0'>
                {items.length === 0 ? (
                    <SimpleEmptyState
                        className='p-0'
                        icon={IconCheck}
                        title={t('All clear')}
                        description={t(
                            'No failed servers, backups, or capacity warnings.'
                        )}
                    />
                ) : (
                    <OverflowItemGroup
                        title={title}
                        max={MAX_VISIBLE}
                        rows={items.map(item => (
                            <AttentionRow key={item.id} item={item} />
                        ))}
                    />
                )}
            </CardContent>
        </Card>
    )
}

export default NeedsAttentionCard
