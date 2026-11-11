import { PASSWORD_MAX_BYTES, PASSWORD_MIN_LENGTH } from '@/utils/password.ts'
import { z } from 'zod'

import { t } from '@/lib/i18n.ts'

/**
 * Mirrors App\Rules\PasswordPolicy: length only, no character composition. The breach check runs
 * server-side (it needs the network), so it arrives as a field error on submit rather than as a
 * criterion the strength indicator can tick off.
 */
const password = z
    .string()
    .min(
        PASSWORD_MIN_LENGTH,
        t('Password must be at least {{PASSWORD_MIN_LENGTH}} characters', {
            PASSWORD_MIN_LENGTH,
        })
    )
    .refine(
        value => new TextEncoder().encode(value).length <= PASSWORD_MAX_BYTES,
        t('Password must be at most {{PASSWORD_MAX_BYTES}} bytes', {
            PASSWORD_MAX_BYTES,
        })
    )

const baseUserSchema = z.object({
    name: z.string().min(1, t('A name is required')).max(191),
    email: z.email(t('Enter a valid email address')).max(191),
    rootAdmin: z.boolean(),
})

/**
 * Blank is meaningful on create: it means "invite them" — the account is made without a usable
 * password and the person on the other end chooses their own. That is the flow that exists so
 * nobody has to pick, or email, a password on someone else's behalf.
 */
export const createUserSchema = baseUserSchema.extend({
    password: z.literal('').or(password),
})

/**
 * The one field that differs between creating and editing: an existing account already has a
 * password, so a blank box means "leave it alone" rather than "no password".
 */
export const updateUserSchema = baseUserSchema.extend({
    password: z.literal('').or(password),
})

export type UserInput = z.infer<typeof createUserSchema>
