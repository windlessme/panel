import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { t } from '@/lib/i18n.ts'

export const searchSchema = z.object({
    redirect: z.string().optional(),
    // Set by the OAuth callback when a federated sign-in fails, so the login page can surface why.
    oauth_error: z.string().optional(),
})

export const Route = createFileRoute('/auth/(login)/login')({
    validateSearch: searchSchema,
    staticData: {
        title: t('Login'),
    },
})
