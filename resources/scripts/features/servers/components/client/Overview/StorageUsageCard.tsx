import { useServer, useServerResources } from '@/features/servers/detail/api.ts'
import { IconAlertTriangle, IconDatabase } from '@tabler/icons-react'
import byteSize from 'byte-size'

import { t } from '@/lib/i18n.ts'

import LinearProgressBar from '@/components/ui/Progress/LinearProgressBar.tsx'
import Skeleton from '@/components/ui/Skeleton.tsx'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/Tooltip'

import StatisticCard from './StatisticCard'

const StorageUsageCard = () => {
    const { data: server } = useServer()
    const { data: resources, error, isLoading } = useServerResources()

    // Usage comes from the guest agent, which answers 409 when it isn't running.
    // Without it we still know the disk limit from the server record, so the card
    // falls back to showing that rather than blanking out.
    const isAvailable = !error && !!resources
    const limitBytes = server?.disk ?? 0

    const usedBytes = isAvailable ? (resources?.usedBytes ?? 0) : 0
    const totalBytes = isAvailable ? (resources?.totalBytes ?? 0) : limitBytes

    const used = byteSize(usedBytes, {
        units: 'iec',
        precision: 2,
    })
    const total = byteSize(totalBytes, {
        units: 'iec',
        precision: 2,
    })

    const usedPercent = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0

    return (
        <StatisticCard
            title={
                <div className={'flex items-center gap-2'}>
                    {t('Storage Usage')}
                    {!isAvailable && !isLoading && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <IconAlertTriangle
                                        className={'h-4 w-4 text-yellow-500'}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {t(
                                        'Guest Agent unavailable. Showing disk limit.'
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            }
            icon={IconDatabase}
            context={
                isLoading
                    ? undefined
                    : isAvailable
                      ? t('of {{limit}} • {{percent}}%', {
                            limit: `${total.value} ${total.unit}`,
                            percent: usedPercent.toFixed(0),
                        })
                      : t('Disk limit • guest agent offline')
            }
            meter={
                isAvailable && (
                    <LinearProgressBar
                        value={usedPercent}
                        aria-label={t('{{percent}}% of your storage is used', {
                            percent: usedPercent.toFixed(2),
                        })}
                    />
                )
            }
        >
            {isLoading ? (
                <Skeleton className={'h-7 w-full @sm:h-8'} />
            ) : (
                <p
                    className={
                        'text-lg font-semibold tracking-tight @sm:text-xl @xl:text-2xl'
                    }
                >
                    {isAvailable
                        ? `${used.value} ${used.unit}`
                        : `${total.value} ${total.unit}`}
                </p>
            )}
        </StatisticCard>
    )
}

export default StorageUsageCard
