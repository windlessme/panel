import useNetworkInterfacesModalStore from '@/features/nodes/hooks/use-network-interfaces-modal-store.ts'
import {
    deleteNetworkInterface,
    networkInterfaceQueries,
} from '@/features/nodes/network-interfaces/api.ts'
import { useModal } from '@/hooks/create-modal-store.ts'
import useAsyncFunction from '@/hooks/use-async-function.ts'
import useQueryMutator from '@/hooks/use-query-mutator.ts'
import { Route } from '@/routes/_app/admin/nodes.$nodeId/network.tsx'
import { NetworkInterface } from '@/types/network-interface.ts'
import { AxiosError } from 'axios'

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

const DeleteNetworkInterfaceModal = () => {
    const { nodeId } = Route.useParams()
    const mutate = useQueryMutator<NetworkInterface[]>(
        networkInterfaceQueries.all(Number(nodeId))
    )
    const {
        open,
        data: networkInterface,
        close,
    } = useModal(useNetworkInterfacesModalStore, 'delete')

    const [state, submit] = useAsyncFunction(
        async (currentNetworkInterface: NetworkInterface) => {
            try {
                await deleteNetworkInterface(
                    Number(nodeId),
                    currentNetworkInterface.id
                )

                await mutate(data => {
                    if (!data) return data
                    return data.filter(
                        item => item.id !== currentNetworkInterface.id
                    )
                }, false)

                toast.add({
                    title: t('Network interface deleted'),
                    type: 'success',
                })
                close()
            } catch (e) {
                let message = 'Deletion failed'

                if (e instanceof AxiosError && e.response?.data.message) {
                    message = e.response.data.message
                }

                toast.add({ title: message, type: 'error' })

                throw e
            }
        }
    )

    return (
        <ResponsiveDialog open={open} onOpenChange={open => !open && close()}>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Delete {{name}}', { name: networkInterface?.name })}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {t(
                            'Are you sure you want to delete this network interface?'
                        )}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <ResponsiveDialogFooter className={'mt-4'}>
                    <ResponsiveDialogClose
                        render={<Button variant={'outline'}>Cancel</Button>}
                    />
                    <Button
                        autoFocus
                        loading={state.loading}
                        variant={'destructive'}
                        onClick={() =>
                            networkInterface && submit(networkInterface)
                        }
                    >
                        {t('Delete')}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default DeleteNetworkInterfaceModal
