import StatisticCard from '@/features/servers/components/client/Overview/StatisticCard.tsx'
import { useServer } from '@/features/servers/detail/api.ts'
import { IconWifi } from '@tabler/icons-react'
import byteSize from 'byte-size'

import { t } from '@/lib/i18n.ts'

import LinearProgressBar from '@/components/ui/Progress/LinearProgressBar.tsx'

const BandwidthUsageCard = () => {
    const { data: server } = useServer()

    const used = byteSize(server?.bandwidth.usage ?? 0, {
        units: 'iec',
        precision: 1,
    })
    const isUnlimited = server?.bandwidth.limit === -1
    const limit = byteSize(!isUnlimited ? (server?.bandwidth.limit ?? 0) : 0, {
        units: 'iec',
        precision: 1,
    })
    const bandwidthUsedPercent =
        server && server.bandwidth.limit > 0
            ? (server.bandwidth.usage / server.bandwidth.limit) * 100
            : 0

    // Stored as bytes per second; the admin form takes it in MB/s and converts.
    const speedLimit = server?.bandwidth.speedLimit ?? null
    const speed = byteSize(speedLimit ?? 0, { precision: 0 })

    return (
        <StatisticCard
            title={t('Bandwidth')}
            icon={IconWifi}
            className={'col-span-2 @5xl:col-span-1'}
            context={
                server ? (
                    <>
                        {isUnlimited
                            ? t('of an unlimited allowance')
                            : t('of {{limit}} • {{percent}}%', {
                                  limit: `${limit.value} ${limit.unit}`,
                                  percent: bandwidthUsedPercent.toFixed(0),
                              })}
                        {/* Only when there is one to report: an uncapped
                            link is the default, and saying so cost the line
                            more width than the fact was worth. Held back to
                            @6xl for the same reason -- see ServerStateCard. */}
                        {speedLimit !== null && (
                            <span className={'hidden @6xl:inline'}>
                                {' • '}
                                {t('capped at {{speed}}/s', {
                                    speed: `${speed.value} ${speed.unit}`,
                                })}
                            </span>
                        )}
                    </>
                ) : undefined
            }
            /* An unlimited allowance has no denominator, so there is no
               proportion to draw -- a bar would have to invent one. */
            meter={
                !isUnlimited && (
                    <LinearProgressBar
                        value={bandwidthUsedPercent}
                        aria-label={t(
                            '{{percent}}% of your bandwidth allowance is used',
                            { percent: bandwidthUsedPercent.toFixed(2) }
                        )}
                    />
                )
            }
        >
            <p
                className={
                    'text-lg font-semibold tracking-tight @sm:text-xl @xl:text-2xl'
                }
            >
                {used.value} {used.unit}
            </p>
        </StatisticCard>
    )
}

export default BandwidthUsageCard
