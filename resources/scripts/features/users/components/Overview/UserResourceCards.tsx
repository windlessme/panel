import StatisticCard from '@/features/servers/components/client/Overview/StatisticCard.tsx'
import type { UserResources } from '@/types/admin/user.ts'
import {
    IconCpu,
    IconDatabase,
    IconDeviceDesktopAnalytics,
    IconServer,
    IconWifi,
} from '@tabler/icons-react'
import byteSize from 'byte-size'

import { t } from '@/lib/i18n.ts'

import LinearProgressBar from '@/components/ui/Progress/LinearProgressBar.tsx'
import Skeleton from '@/components/ui/Skeleton.tsx'

interface Props {
    resources: UserResources | undefined
}

const format = (bytes: number) => {
    const size = byteSize(bytes, { units: 'iec', precision: 1 })

    return `${size.value} ${size.unit}`
}

/** The figure, in the type the statistic row uses everywhere else. */
const Value = ({ children }: { children: React.ReactNode }) => (
    <span
        className={
            'text-lg font-semibold tracking-tight @sm:text-xl @xl:text-2xl'
        }
    >
        {children}
    </span>
)

const Sub = ({ children }: { children: React.ReactNode }) => (
    <span className={'text-muted-foreground block text-sm'}>{children}</span>
)

/**
 * What one account is holding, as the same tiles the server overview uses.
 *
 * Allocation, not consumption: these are the limits written on the account's servers, which is the
 * figure an operator sizing a node or reading a support ticket is after. Live CPU and memory usage
 * belongs to a server, and lives on that server's own page.
 */
const UserResourceCards = ({ resources }: Props) => {
    if (!resources) {
        return (
            <div
                className={
                    'grid grid-cols-2 gap-4 @2xl:grid-cols-3 @5xl:grid-cols-5'
                }
            >
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className={'h-[7.5rem] w-full'} />
                ))}
            </div>
        )
    }

    const isUnmetered = resources.bandwidthLimit === null
    const usedPercent =
        resources.bandwidthLimit && resources.bandwidthLimit > 0
            ? Math.min(
                  (resources.bandwidthUsage / resources.bandwidthLimit) * 100,
                  100
              )
            : 0

    /*
     * Suspension and an unfinished build are separate facts about a server and a server can be
     * both, so they are listed rather than summed into one "not healthy" number.
     */
    const serverNotes = [
        resources.suspendedCount > 0 &&
            t('{{suspended}} suspended', {
                suspended: resources.suspendedCount,
            }),
        resources.unbuiltCount > 0 &&
            t('{{unbuilt}} not built', { unbuilt: resources.unbuiltCount }),
    ].filter(Boolean) as string[]

    return (
        <div
            className={
                'grid grid-cols-2 gap-4 @2xl:grid-cols-3 @5xl:grid-cols-5'
            }
        >
            <StatisticCard compact title={t('Servers')} icon={IconServer}>
                <p>
                    <Value>{resources.serversCount}</Value>
                    <Sub>
                        {serverNotes.length > 0
                            ? serverNotes.join(' · ')
                            : resources.serversCount > 0
                              ? t('all active')
                              : t('none yet')}
                    </Sub>
                </p>
            </StatisticCard>

            <StatisticCard compact title={'vCPU'} icon={IconCpu}>
                <p>
                    <Value>{resources.cpu}</Value>
                    <Sub>
                        {resources.nodesCount > 0
                            ? t('allocated across {{count}} nodes', {
                                  count: resources.nodesCount,
                              })
                            : t('allocated')}
                    </Sub>
                </p>
            </StatisticCard>

            <StatisticCard
                compact
                title={t('Memory')}
                icon={IconDeviceDesktopAnalytics}
            >
                <p>
                    <Value>{format(resources.memory)}</Value>
                    <Sub>{t('allocated')}</Sub>
                </p>
            </StatisticCard>

            <StatisticCard compact title={t('Disk')} icon={IconDatabase}>
                <p>
                    <Value>{format(resources.disk)}</Value>
                    <Sub>{t('allocated')}</Sub>
                </p>
            </StatisticCard>

            <StatisticCard
                compact
                title={t('Bandwidth')}
                icon={IconWifi}
                className={'col-span-2 @2xl:col-span-1'}
                meter={
                    /* No ratio, no bar — an unmetered account is not a full one. */
                    !isUnmetered && (
                        <LinearProgressBar
                            value={usedPercent}
                            aria-label={t(
                                '{{percent}}% of the summed bandwidth allowance is used',
                                { percent: usedPercent.toFixed(0) }
                            )}
                        />
                    )
                }
            >
                <p>
                    <Value>{format(resources.bandwidthUsage)}</Value>
                    <Sub>
                        {isUnmetered
                            ? t('used · at least one server unmetered')
                            : t('of {{limit}} this period', {
                                  limit: format(resources.bandwidthLimit ?? 0),
                              })}
                    </Sub>
                </p>
            </StatisticCard>
        </div>
    )
}

export default UserResourceCards
