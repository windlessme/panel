import AuthSetting from '@/features/account/components/AuthSetting.tsx'
import { updatePassword } from '@/features/account/password/api.ts'
import { handleFormErrors } from '@/utils/http.ts'
import { PASSWORD_MAX_BYTES, PASSWORD_MIN_LENGTH } from '@/utils/password.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import { Form, FormButton } from '@/components/ui/Form'
import { InputForm } from '@/components/ui/Forms'
import PasswordStrengthIndicator from '@/components/ui/Password/PasswordStrengthIndicator.tsx'
import {
    ResponsiveDialog,
    ResponsiveDialogBody,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
    ResponsiveDialogTrigger,
} from '@/components/ui/ResponsiveDialog'
import { toast } from '@/components/ui/Toast'

const schema = z
    .object({
        currentPassword: z.string().min(1, t('Current password is required')),
        password: z
            .string()
            .min(
                PASSWORD_MIN_LENGTH,
                t('Password must be at least {{min}} characters', {
                    min: PASSWORD_MIN_LENGTH,
                })
            )
            .refine(
                pwd =>
                    new TextEncoder().encode(pwd).length <= PASSWORD_MAX_BYTES,
                t('Password must be at most {{max}} bytes', {
                    max: PASSWORD_MAX_BYTES,
                })
            ),
        passwordConfirmation: z
            .string()
            .min(1, t('Password confirmation is required')),
    })
    .refine(data => data.password === data.passwordConfirmation, {
        message: t("Passwords don't match"),
        path: ['passwordConfirmation'],
    })

const PasswordChangeDialog = () => {
    const [open, setOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            currentPassword: '',
            password: '',
            passwordConfirmation: '',
        },
    })

    const password = form.watch('password')

    const submit = async (data: z.infer<typeof schema>) => {
        try {
            await updatePassword(data)
            form.reset()
            setOpen(false)
            toast.add({ title: t('Password updated'), type: 'success' })
        } catch (error) {
            handleFormErrors(error, form.setError)

            throw error
        }
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={setOpen}>
            <ResponsiveDialogTrigger
                render={
                    <AuthSetting
                        title={t('Password')}
                        description={t('Change your account password')}
                        onClick={() => {}}
                    />
                }
            />
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Change Your Password')}
                    </ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <ResponsiveDialogBody className={'space-y-2'}>
                            <InputForm
                                label={t('Current Password')}
                                name={'currentPassword'}
                                autoComplete='current-password'
                                type={'password'}
                            />
                            <InputForm
                                label={t('Password')}
                                name={'password'}
                                autoComplete={'new-password'}
                                type={'password'}
                            />
                            <PasswordStrengthIndicator password={password} />
                            <InputForm
                                label={t('Confirm Password')}
                                name={'passwordConfirmation'}
                                autoComplete={'new-password'}
                                type={'password'}
                            />
                        </ResponsiveDialogBody>
                        <ResponsiveDialogFooter className={'mt-4'}>
                            <ResponsiveDialogClose
                                render={
                                    <Button variant={'outline'} type={'button'}>
                                        {t('Cancel')}
                                    </Button>
                                }
                            />
                            <FormButton>{t('Confirm')}</FormButton>
                        </ResponsiveDialogFooter>
                    </form>
                </Form>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default PasswordChangeDialog
