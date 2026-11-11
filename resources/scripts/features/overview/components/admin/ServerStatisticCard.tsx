import StatisticCard from '@/features/servers/components/client/Overview/StatisticCard.tsx'
import { IconServer } from '@tabler/icons-react'

import { t } from '@/lib/i18n.ts'

const ServerStatisticCard = () => {
    return (
        <StatisticCard title={t('Servers')} icon={IconServer}></StatisticCard>
    )
}

export default ServerStatisticCard
