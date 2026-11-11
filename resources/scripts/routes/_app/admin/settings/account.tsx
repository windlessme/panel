import { accountSettingsQuery } from '@/features/settings/api.ts'
import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'
import { queryClient } from '@/lib/query-client.ts'

export const Route = createFileRoute('/_app/admin/settings/account')({
    loader: () => queryClient.ensureQueryData(accountSettingsQuery()),
    staticData: {
        title: t('Account Settings'),
    },
})
