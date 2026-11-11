import type { TimeRange } from '@/features/servers/detail/api.ts'

import { t } from '@/lib/i18n.ts'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'

const timeRangeItems = [
    { value: 'hour', label: t('Hourly') },
    { value: 'day', label: t('Daily') },
    { value: 'week', label: t('Weekly') },
    { value: 'month', label: t('Monthly') },
    { value: 'year', label: t('Yearly') },
] as const

interface Props {
    from: TimeRange
    setFrom: (from: TimeRange) => void
}

const TimeRangeSelector = ({ from, setFrom }: Props) => {
    return (
        <>
            <Tabs
                value={from}
                onValueChange={val => setFrom(val as TimeRange)}
                className={'mb-5 hidden @sm:block'}
            >
                <TabsList>
                    <TabsTrigger value='hour'>{t('Hourly')}</TabsTrigger>
                    <TabsTrigger value='day'>{t('Daily')}</TabsTrigger>
                    <TabsTrigger value='week'>{t('Weekly')}</TabsTrigger>
                    <TabsTrigger value='month'>{t('Monthly')}</TabsTrigger>
                    <TabsTrigger value='year'>{t('Yearly')}</TabsTrigger>
                </TabsList>
            </Tabs>
            <Select
                items={timeRangeItems}
                value={from}
                onValueChange={value => value && setFrom(value)}
            >
                <SelectTrigger className={'mb-5 flex w-56 @sm:hidden'}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {timeRangeItems.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    )
}

export default TimeRangeSelector
