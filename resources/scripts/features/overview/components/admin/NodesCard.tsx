import { IconAlertTriangle, IconServerBolt } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SimpleEmptyState } from '@/components/ui/EmptyStates'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from '@/components/ui/Item'
import { LinearProgressBar } from '@/components/ui/Progress'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/Tooltip'
import { StatLabel } from '@/components/ui/Typography'

import {
    bytes,
    capacityTone,
    meterIndicatorClass,
    num,
} from './overview-helpers'

type NodeSummary = App.Data.Admin.Overview.NodeSummaryData
type ResourceUsage = App.Data.Admin.Overview.ResourceUsageData

const Meter = ({ percent, label }: { percent: number; label: string }) => (
    <LinearProgressBar
        value={Math.min(percent, 100)}
        aria-label={t('{{label}}: {{percent}}%', { label, percent })}
        indicatorClassName={meterIndicatorClass[capacityTone(percent)]}
    />
)

const Usage = ({
    usage,
    label,
    sub,
}: {
    usage: ResourceUsage
    label: string
    sub?: string
}) => (
    <div className='min-w-32'>
        <div className='mb-1.5 flex items-baseline justify-between gap-2'>
            <span className='text-sm font-semibold tabular-nums'>
                {usage.percent}%
            </span>
            <StatLabel
                as='span'
                className='text-xs whitespace-nowrap tabular-nums'
            >
                {bytes(usage.used)} / {bytes(usage.total)}
            </StatLabel>
        </div>
        <Meter percent={usage.percent} label={label} />
        {sub && <StatLabel className='mt-1.5 text-xs'>{sub}</StatLabel>}
    </div>
)

/**
 * A metric we couldn't poll gets the conventional table dash rather than an
 * empty meter — a zeroed bar reads as "nothing is in use", which is a very
 * different claim from "we don't know". The row's single warning marker
 * carries the explanation, so the cells themselves stay quiet.
 */
const NoMetric = ({ sub }: { sub?: string }) => (
    <div className='min-w-32'>
        <span className='text-muted-foreground text-sm' aria-hidden>
            —
        </span>
        <span className='sr-only'>{t('Unavailable')}</span>
        {sub && <StatLabel className='mt-1.5 text-xs'>{sub}</StatLabel>}
    </div>
)

/**
 * Every datastore on the node as one figure.
 *
 * A meter per store would make this cell grow without bound — a host with a
 * dozen datastores turns one table row into a dozen meters, and the card is
 * meant to be read at a glance across a fleet. The per-store breakdown lives on
 * the node's Storages tab.
 *
 * A node with no datastores falls back to the host's root filesystem rather
 * than an empty cell — that is the figure this column used to show, and "none
 * reported" is not the same as "nothing to say".
 */
const NodeStorage = ({ node }: { node: NodeSummary }) => {
    if (!node.resources) {
        return <NoMetric />
    }

    const { storage, datastoreCount, unreadableDatastores } = node.resources

    if (datastoreCount === 0) {
        return (
            <Usage
                usage={node.resources.disk}
                label={t('Root filesystem used on {{name}}', {
                    name: node.displayName,
                })}
                sub={t('Root filesystem — no datastores reported')}
            />
        )
    }

    return (
        <Usage
            usage={storage}
            label={t('Storage used on {{name}}', {
                name: node.displayName,
            })}
            sub={
                t('Across {{count, number}} datastores', {
                    count: datastoreCount,
                }) +
                // Naming the excluded stores matters: without it the total looks
                // like the whole picture when part of it could not be read.
                (unreadableDatastores > 0
                    ? ` · ${t('{{count, number}} unreadable', { count: unreadableDatastores })}`
                    : '')
            }
        />
    )
}

const statusLabel: Record<NodeSummary['status'], string> = {
    online: t('Online'),
    unreachable: t('Unreachable'),
    unknown: t('Unknown'),
}

const statusText: Record<NodeSummary['status'], string> = {
    online: '',
    unreachable: 'text-destructive',
    unknown: 'text-muted-foreground',
}

/**
 * One word beside the node's name, and only when there is something to say.
 *
 * A healthy host is marked by the absence of a marker: the card exists to find
 * the one node in trouble, and a green "Online" on every other row is the noise
 * that hides it. Colour alone doesn't carry the state either — the word does,
 * so the row still reads without it.
 */
const StatusMarker = ({ node }: { node: NodeSummary }) =>
    node.status === 'online' ? null : (
        <span
            className={`shrink-0 text-xs capitalize ${statusText[node.status]}`}
        >
            {statusLabel[node.status]}
        </span>
    )

/**
 * When the poll failed, a single warning that explains every dash in the row at
 * once, instead of repeating a marker in each metric cell. A row whose figures
 * did arrive says nothing here — the numbers are their own provenance.
 */
const SnapshotMeta = ({ node }: { node: NodeSummary }) =>
    node.resources ? null : (
        <Tooltip>
            {/* A real trigger element (not `asChild` over a span) so the
                explanation is reachable by keyboard, matching
                NodeStatusIndicator. */}
            <TooltipTrigger className='text-muted-foreground flex cursor-help items-center gap-1 text-xs'>
                <IconAlertTriangle
                    className='size-3.5 shrink-0 text-amber-600 dark:text-amber-400'
                    aria-hidden
                />
                {t('Metrics unavailable')}
            </TooltipTrigger>
            <TooltipContent className='max-w-64'>
                {t(
                    "Couldn't fetch resource usage from this node. Memory and storage figures are unknown until it reports again."
                )}
            </TooltipContent>
        </Tooltip>
    )

const ServerCount = ({ node }: { node: NodeSummary }) => (
    <>
        {num(node.servers)}{' '}
        <span className='text-label font-normal'>
            {t('servers', { count: node.servers })}
        </span>
    </>
)

const NodesCard = ({ nodes }: { nodes: NodeSummary[] }) => (
    <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 p-5 pb-2'>
            <CardTitle className='text-base'>{t('Nodes')}</CardTitle>
            <StatLabel as='span' className='text-xs'>
                {t('{{count, number}} hosts', { count: nodes.length })}
            </StatLabel>
        </CardHeader>
        <CardContent className='p-5 pt-2'>
            {nodes.length === 0 ? (
                <SimpleEmptyState
                    className='p-0 py-4'
                    icon={IconServerBolt}
                    title={t('No nodes yet')}
                    description={t('Add a node to start provisioning servers.')}
                    action={
                        <Link className={buttonVariants()} to='/admin/nodes'>
                            {t('Add node')}
                        </Link>
                    }
                />
            ) : (
                <>
                    {/* Desktop: dense table */}
                    <div className='hidden @2xl:block'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='pl-0'>
                                        {t('Node')}
                                    </TableHead>
                                    <TableHead className='w-20 text-center'>
                                        {t('Servers')}
                                    </TableHead>
                                    <TableHead className='w-[32%]'>
                                        {t('Memory')}
                                    </TableHead>
                                    <TableHead className='w-[32%]'>
                                        {t('Storage')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nodes.map(node => (
                                    <TableRow key={node.id}>
                                        {/* Cells align to the top so every
                                            meter in the row shares a baseline:
                                            the memory cell is a line taller
                                            than the others, and `align-middle`
                                            would push its neighbours' bars out
                                            of step with it. */}
                                        <TableCell className='pl-0 align-top'>
                                            <div className='flex items-center gap-2'>
                                                <div className='font-semibold'>
                                                    {node.displayName}
                                                </div>
                                                <StatusMarker node={node} />
                                            </div>
                                            <div className='text-muted-foreground font-mono text-xs'>
                                                {node.fqdn}
                                            </div>
                                            {!node.resources && (
                                                <div className='mt-1'>
                                                    <SnapshotMeta node={node} />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center align-top tabular-nums'>
                                            {num(node.servers)}
                                        </TableCell>
                                        <TableCell className='align-top'>
                                            {node.resources ? (
                                                <Usage
                                                    usage={
                                                        node.resources.memory
                                                    }
                                                    label={t(
                                                        'Memory used on {{name}}',
                                                        {
                                                            name: node.displayName,
                                                        }
                                                    )}
                                                    sub={t(
                                                        '{{allocated}} committed',
                                                        {
                                                            allocated: bytes(
                                                                node.memory
                                                                    .allocated
                                                            ),
                                                        }
                                                    )}
                                                />
                                            ) : (
                                                <NoMetric
                                                    sub={t(
                                                        '{{allocated}} committed',
                                                        {
                                                            allocated: bytes(
                                                                node.memory
                                                                    .allocated
                                                            ),
                                                        }
                                                    )}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className='pr-0 align-top'>
                                            <NodeStorage node={node} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile: stacked rows so the meter never gets squeezed.
                        The table's column headers carry the labelling on
                        desktop, so the meter has to be labelled explicitly
                        here. */}
                    <ItemGroup className='gap-3 @2xl:hidden'>
                        {nodes.map(node => (
                            <Item key={node.id} variant='muted' size='sm'>
                                <ItemContent className='min-w-0'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <div className='min-w-0'>
                                            {/* ItemTitle is a `w-fit` flex row,
                                                so the ellipsis has to live on a
                                                child that can actually shrink. */}
                                            <ItemTitle className='w-full min-w-0'>
                                                <span className='truncate'>
                                                    {node.displayName}
                                                </span>
                                                <StatusMarker node={node} />
                                            </ItemTitle>
                                            {/* `block`/`text-nowrap` beat
                                                ItemDescription's default
                                                line-clamp-2 + text-balance,
                                                which otherwise silently defeat
                                                `truncate`. */}
                                            <ItemDescription className='block truncate font-mono text-xs text-nowrap'>
                                                {node.fqdn}
                                            </ItemDescription>
                                        </div>
                                        <div className='shrink-0 text-sm font-semibold tracking-tight tabular-nums'>
                                            <ServerCount node={node} />
                                        </div>
                                    </div>
                                    {!node.resources && (
                                        <div className='mt-2.5 mb-1.5'>
                                            <SnapshotMeta node={node} />
                                        </div>
                                    )}
                                    {node.resources ? (
                                        <div className='grid grid-cols-1 gap-3 @lg:grid-cols-2'>
                                            <div>
                                                <StatLabel className='mb-1.5 text-xs'>
                                                    {t('Memory')}
                                                </StatLabel>
                                                <Usage
                                                    usage={
                                                        node.resources.memory
                                                    }
                                                    label={t(
                                                        'Memory used on {{name}}',
                                                        {
                                                            name: node.displayName,
                                                        }
                                                    )}
                                                    sub={t(
                                                        '{{allocated}} committed',
                                                        {
                                                            allocated: bytes(
                                                                node.memory
                                                                    .allocated
                                                            ),
                                                        }
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <StatLabel className='mb-1.5 text-xs'>
                                                    {t('Storage')}
                                                </StatLabel>
                                                <NodeStorage node={node} />
                                            </div>
                                        </div>
                                    ) : (
                                        <StatLabel className='text-xs'>
                                            {t(
                                                '{{allocated}} memory committed',
                                                {
                                                    allocated: bytes(
                                                        node.memory.allocated
                                                    ),
                                                }
                                            )}
                                        </StatLabel>
                                    )}
                                </ItemContent>
                            </Item>
                        ))}
                    </ItemGroup>
                </>
            )}
        </CardContent>
    </Card>
)

export default NodesCard
