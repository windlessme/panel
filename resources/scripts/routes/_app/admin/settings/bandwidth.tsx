import { settingsQueries } from '@/features/settings/api.ts'
import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'
import { queryClient } from '@/lib/query-client.ts'

export const Route = createFileRoute('/_app/admin/settings/bandwidth')({
    loader: () => queryClient.ensureQueryData(settingsQueries.bandwidth()),
    staticData: {
        title: t('Bandwidth Settings'),
    },
})
