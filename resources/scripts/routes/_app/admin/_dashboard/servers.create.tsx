import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute('/_app/admin/_dashboard/servers/create')({
    staticData: {
        title: t('New server'),
    },
})
