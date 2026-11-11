import { deleteAddress } from '@/features/ipam/blocks/addresses/api.ts'
import { useAddressModal } from '@/features/ipam/hooks/use-address-modal.ts'
import { useModal } from '@/hooks/create-modal-store.ts'
import { PaginatedAddresses } from '@/types/address.ts'
import { Mutator } from '@/types/query.ts'
import { useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from '@/components/ui/ResponsiveDialog'
import { toast } from '@/components/ui/Toast'

interface Props {
    mutate: Mutator<PaginatedAddresses>
}

const DeleteAddressModal = ({ mutate }: Props) => {
    const { addressBlockGroupId, addressBlockId } = useParams({
        strict: false,
    }) as { addressBlockGroupId: string; addressBlockId: string }

    const { open, data: address, close } = useModal(useAddressModal, 'delete')

    const { mutate: deleteAddressTrigger, isPending: isMutating } = useMutation(
        {
            mutationFn: async () => {
                if (!address) return

                await deleteAddress(
                    Number(addressBlockGroupId),
                    Number(addressBlockId),
                    address.id
                )

                await mutate(data => {
                    if (!data) return
                    return {
                        ...data,
                        items: data.items.filter(
                            item => item.id !== address.id
                        ),
                    }
                }, false)

                close()
                toast.add({ title: t('Address deleted'), type: 'success' })
            },
            onError: () => {
                toast.add({
                    title: t('Failed to delete address'),
                    type: 'error',
                })
            },
        }
    )

    return (
        <ResponsiveDialog open={open} onOpenChange={open => !open && close()}>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Delete {{ip}}', { ip: address?.ip })}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {t(
                            'Are you sure you want to delete this address? This action cannot be undone.'
                        )}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={
                            <Button variant={'outline'} type={'button'}>
                                {t('Cancel')}
                            </Button>
                        }
                    />
                    <Button
                        variant={'destructive'}
                        onClick={() => deleteAddressTrigger()}
                        loading={isMutating}
                    >
                        {t('Delete')}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default DeleteAddressModal
