import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute('/_app/servers/$serverUuid/graphs')({
    staticData: {
        title: t('Graphs'),
    },
})
