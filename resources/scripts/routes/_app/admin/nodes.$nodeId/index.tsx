import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute('/_app/admin/nodes/$nodeId/')({
    staticData: {
        title: t('Overview'),
    },
})
