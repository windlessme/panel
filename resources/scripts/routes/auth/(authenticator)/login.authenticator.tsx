import { searchSchema } from '@/routes/auth/(login)/login.tsx'
import { createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute(
    '/auth/(authenticator)/login/authenticator'
)({
    validateSearch: searchSchema,
    staticData: {
        title: t('2FA Required'),
    },
})
