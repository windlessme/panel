import { ZodString, z } from 'zod'

import { t } from '@/lib/i18n.ts'

export const hostname = (string?: ZodString) =>
    (string ?? z.string()).regex(
        /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
        {
            message: t('Invalid hostname'),
        }
    )
