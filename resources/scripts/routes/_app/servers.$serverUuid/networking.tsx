import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute('/_app/servers/$serverUuid/networking')({
    staticData: {
        title: t('Networking'),
    },
})
