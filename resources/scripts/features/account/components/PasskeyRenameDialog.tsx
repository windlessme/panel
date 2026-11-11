import { usePasskeysModalStore } from '@/features/account/components/PasskeysContainer.tsx'
import {
    passkeyQueries,
    renamePasskey,
} from '@/features/account/passkeys/api.ts'
import { useModal } from '@/hooks/create-modal-store.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import { Form, FormButton } from '@/components/ui/Form'
import { InputForm } from '@/components/ui/Forms'
import {
    ResponsiveDialog,
    ResponsiveDialogBody,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from '@/components/ui/ResponsiveDialog'
import { toast } from '@/components/ui/Toast'

const schema = z.object({
    name: z.string().min(1).max(40),
})

const PasskeyRenameDialog = () => {
    const queryClient = useQueryClient()
    const {
        open: isRenameDialogOpen,
        data: passkey,
        close,
    } = useModal(usePasskeysModalStore, 'rename')

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: passkey?.name ?? '',
        },
    })

    useEffect(() => {
        form.reset({ name: passkey?.name })
    }, [passkey])

    const submit = async (data: z.infer<typeof schema>) => {
        if (!passkey) return

        await renamePasskey(passkey.id, data.name)

        toast.add({ title: t('Passkey renamed'), type: 'success' })

        await queryClient.invalidateQueries({ queryKey: passkeyQueries.all() })

        close()
    }

    return (
        <ResponsiveDialog
            open={isRenameDialogOpen}
            onOpenChange={open => !open && close()}
        >
            <ResponsiveDialogContent className={'max-h-[50vh]'}>
                <ResponsiveDialogHeader className={'overflow-x-hidden'}>
                    <ResponsiveDialogTitle className={'truncate'}>
                        {t('Rename {{name}}', { name: passkey?.name })}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {t('Change the name of this passkey.')}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <ResponsiveDialogBody>
                            <InputForm name={'name'} label={t('Name')} />
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

export default PasskeyRenameDialog
