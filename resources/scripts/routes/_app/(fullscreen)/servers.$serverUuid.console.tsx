import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute(
    '/_app/(fullscreen)/servers/$serverUuid/console'
)({
    validateSearch: z.object({
        type: z.enum(['novnc', 'xtermjs']).catch('novnc'),
    }),
    staticData: { title: t('Console') },
})
