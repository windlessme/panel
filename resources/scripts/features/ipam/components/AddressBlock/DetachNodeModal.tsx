import { detachNode } from '@/features/ipam/api.ts'
import useAsyncFunction from '@/hooks/use-async-function.ts'
import { Route } from '@/routes/_app/admin/_dashboard/ipam/$addressBlockGroupId.tsx'
import { PaginatedNetworkInterfaces } from '@/types/network-interface.ts'
import { Node } from '@/types/node.ts'
import { Mutator } from '@/types/query.ts'

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
    mutate: Mutator<PaginatedNetworkInterfaces>
    node: Node | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DetachNodeModal = ({ mutate, node, open, onOpenChange }: Props) => {
    const { addressBlockGroupId } = Route.useParams()

    const [state, submit] = useAsyncFunction(async () => {
        try {
            if (!node) return

            await detachNode(Number(addressBlockGroupId), node.id)
            await mutate(data => {
                if (!data) return

                return {
                    ...data,
                    items: data.items.filter(item => item.nodeId !== node.id),
                }
            }, false)
            toast.add({
                title: t('Node detached successfully'),
                type: 'success',
            })
            onOpenChange(false)
        } catch (e) {
            toast.add({ title: t('Failed to detach node'), type: 'error' })
            throw e
        }
    })

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Detach {{name}}', {
                            name: node?.displayName || t('Node'),
                        })}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {t(
                            'Are you sure you want to detach this node from the address block group?'
                        )}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <ResponsiveDialogFooter className='mt-4'>
                    <ResponsiveDialogClose
                        render={
                            <Button variant='outline'>{t('Cancel')}</Button>
                        }
                    />
                    <Button
                        autoFocus
                        loading={state.loading}
                        variant='destructive'
                        onClick={submit}
                    >
                        {t('Detach')}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default DetachNodeModal
