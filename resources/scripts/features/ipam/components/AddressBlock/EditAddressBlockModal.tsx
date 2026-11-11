import {
    addressBlockSchema,
    updateAddressBlock,
} from '@/features/ipam/blocks/api.ts'
import { useAddressBlockModal } from '@/features/ipam/hooks/use-address-block-modal.ts'
import { useModal } from '@/hooks/create-modal-store.ts'
import { PaginatedAddressBlocks } from '@/types/address-block.ts'
import { Mutator } from '@/types/query.ts'
import { handleFormErrors } from '@/utils/http.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import { Form, FormButton } from '@/components/ui/Form'
import { InputForm, TextareaForm } from '@/components/ui/Forms'
import {
    ResponsiveDialog,
    ResponsiveDialogBody,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from '@/components/ui/ResponsiveDialog'
import { toast } from '@/components/ui/Toast'

interface Props {
    addressBlockGroupId: number
    mutate: Mutator<PaginatedAddressBlocks>
}

const EditAddressBlockModal = ({ addressBlockGroupId, mutate }: Props) => {
    const {
        open,
        data: addressBlock,
        close,
    } = useModal(useAddressBlockModal, 'edit')

    const form = useForm({
        resolver: zodResolver(addressBlockSchema),
        defaultValues: {
            name: '',
            description: '',
            version: addressBlock?.version,
            baseIp: '',
            gateway: '',
            macAddress: '',
            prefixLengthFrom: 0,
            prefixLengthTo: 0,
        },
    })

    useEffect(() => {
        if (!addressBlock) return

        form.reset({
            name: addressBlock.name || '',
            description: addressBlock.description || '',
            version: addressBlock.version,
            baseIp: addressBlock.baseIp,
            gateway: addressBlock.gateway || '',
            macAddress: addressBlock.macAddress || '',
            prefixLengthFrom: addressBlock.prefixLengthFrom,
            prefixLengthTo: addressBlock.prefixLengthTo,
        })
    }, [addressBlock])

    const submit = async (data: z.infer<typeof addressBlockSchema>) => {
        try {
            if (!addressBlock) return

            const updatedAddressBlock = await updateAddressBlock(
                addressBlockGroupId,
                addressBlock.id,
                data
            )

            await mutate(data => {
                if (!data) return

                return {
                    ...data,
                    items: data.items.map(item => {
                        if (item.id === updatedAddressBlock.id) {
                            return updatedAddressBlock
                        }
                        return item
                    }),
                }
            }, false)

            close()
            toast.add({ title: t('Address block updated'), type: 'success' })
        } catch (e) {
            handleFormErrors(e, form.setError)
            toast.add({ title: t('Failed to save changes'), type: 'error' })
            throw e
        }
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={open => !open && close()}>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Editing')}{' '}
                        {addressBlock?.name || t('Address Block')}
                    </ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit as any)}>
                        <ResponsiveDialogBody className={'space-y-2'}>
                            <InputForm name={'name'} label={t('Name')} />
                            <TextareaForm
                                name={'description'}
                                label={t('Description')}
                            />
                            <InputForm name={'baseIp'} label={t('Base IP')} />
                            <InputForm name={'gateway'} label={t('Gateway')} />
                            <InputForm
                                name={'macAddress'}
                                label={t('MAC Address')}
                            />
                            <div className={'grid grid-cols-2 gap-2'}>
                                <InputForm
                                    name={'prefixLengthFrom'}
                                    label={t('Source Prefix Length')}
                                    type={'number'}
                                    min={0}
                                    max={128}
                                />
                                <InputForm
                                    name={'prefixLengthTo'}
                                    label={t('Output Prefix Length')}
                                    type={'number'}
                                    min={0}
                                    max={128}
                                />
                            </div>
                        </ResponsiveDialogBody>
                        <ResponsiveDialogFooter className={'mt-4'}>
                            <ResponsiveDialogClose
                                render={
                                    <Button variant={'outline'} type={'button'}>
                                        Cancel
                                    </Button>
                                }
                            />
                            <FormButton>{t('Save')}</FormButton>
                        </ResponsiveDialogFooter>
                    </form>
                </Form>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default EditAddressBlockModal
