import {
    imageGroupQueries,
    imageGroupSchema,
    updateImageGroup,
} from '@/features/images/api.ts'
import ImageIconSelect from '@/features/images/components/ImageIconSelect.tsx'
import useImageGroupsModalStore from '@/features/images/hooks/use-image-groups-modal-store.ts'
import { useModal } from '@/hooks/create-modal-store.ts'
import useQueryMutator from '@/hooks/use-query-mutator.ts'
import { ImageGroup, ImageIcon } from '@/types/image.ts'
import { handleFormErrors } from '@/utils/http.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import { Form, FormButton } from '@/components/ui/Form'
import { CheckboxForm, InputForm, TextareaForm } from '@/components/ui/Forms'
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

const EditImageGroupModal = () => {
    const mutate = useQueryMutator<ImageGroup[]>(
        imageGroupQueries.list({}).queryKey
    )

    const {
        open: isOpen,
        data: modalData,
        close,
    } = useModal(useImageGroupsModalStore, 'edit')

    const form = useForm<z.input<typeof imageGroupSchema>>({
        resolver: zodResolver(imageGroupSchema),
    })

    useEffect(() => {
        if (modalData) {
            form.reset({
                name: modalData.name,
                description: modalData.description ?? '',
                icon: modalData.icon as ImageIcon,
                isAdminOnly: modalData.isAdminOnly,
            })
        }
    }, [modalData])

    const { mutate: trigger } = useMutation({
        mutationFn: (arg: z.infer<typeof imageGroupSchema>) => {
            if (!modalData) throw new Error(t('No image group selected'))

            return updateImageGroup(modalData.uuid, arg)
        },
        onSuccess: updatedGroup => {
            mutate((currentData: ImageGroup[] | undefined) => {
                if (!currentData) return
                return currentData.map(group =>
                    group.uuid === updatedGroup.uuid ? updatedGroup : group
                )
            }, false)

            close()
            toast.add({
                title: t('Image group updated'),
                type: 'success',
            })
        },
        onError: e => {
            handleFormErrors(e, form.setError)
            toast.add({ title: t('Failed to save changes'), type: 'error' })
        },
    })

    const submit = (data: z.input<typeof imageGroupSchema>) => {
        trigger(data as z.infer<typeof imageGroupSchema>)
    }

    return (
        <ResponsiveDialog open={isOpen} onOpenChange={() => close()}>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Edit image group')}
                    </ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <ResponsiveDialogBody className={'space-y-4'}>
                            <InputForm name={'name'} label={t('Name')} />
                            <TextareaForm
                                name={'description'}
                                label={t('Description')}
                                description={t(
                                    'This is visible to non-admins too.'
                                )}
                            />
                            <ImageIconSelect />
                            <CheckboxForm
                                name={'isAdminOnly'}
                                label={t('Admin only')}
                                description={t(
                                    'If checked, this image group will only be accessible to admin users.'
                                )}
                            />
                        </ResponsiveDialogBody>
                        <ResponsiveDialogFooter className={'mt-4'}>
                            <ResponsiveDialogClose
                                render={
                                    <Button variant={'outline'} type={'button'}>
                                        Cancel
                                    </Button>
                                }
                            />
                            <FormButton>{t('Save changes')}</FormButton>
                        </ResponsiveDialogFooter>
                    </form>
                </Form>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default EditImageGroupModal
