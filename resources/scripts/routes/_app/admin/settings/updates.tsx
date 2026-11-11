import { updateQueries } from '@/features/updates/api.ts'
import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'
import { queryClient } from '@/lib/query-client.ts'

export const Route = createFileRoute('/_app/admin/settings/updates')({
    loader: () => queryClient.ensureQueryData(updateQueries.status()),
    staticData: {
        title: t('Updates'),
    },
})
