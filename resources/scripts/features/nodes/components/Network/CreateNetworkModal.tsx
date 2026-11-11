import {
    createNetworkInterface,
    networkInterfaceQueries,
    networkInterfaceSchema,
} from '@/features/nodes/network-interfaces/api.ts'
import useQueryMutator from '@/hooks/use-query-mutator.ts'
import { Route as NetworkRoute } from '@/routes/_app/admin/nodes.$nodeId/network.tsx'
import { NetworkInterface } from '@/types/network-interface.ts'
import { handleFormErrors } from '@/utils/http.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
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
    ResponsiveDialogTrigger,
} from '@/components/ui/ResponsiveDialog'
import { toast } from '@/components/ui/Toast'

const CreateNetworkModal = () => {
    const { nodeId } = NetworkRoute.useParams()
    const mutate = useQueryMutator<NetworkInterface[]>(
        networkInterfaceQueries.all(Number(nodeId))
    )
    const [open, setOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(networkInterfaceSchema),
        defaultValues: {
            name: '',
            description: '',
            isVlanAware: false,
            vlanTag: '',
        },
    })
    const isVlanAware = form.watch('isVlanAware')

    useEffect(() => {
        if (!isVlanAware) {
            form.setValue('vlanTag', '')
        }
    }, [form, isVlanAware])

    const submit = async (data: z.infer<typeof networkInterfaceSchema>) => {
        try {
            const networkInterface = await createNetworkInterface(
                Number(nodeId),
                data
            )

            await mutate(data => {
                if (!data) return

                return data.concat(networkInterface)
            }, false)

            form.reset()
            setOpen(false)
            toast.add({
                title: t('Network interface created'),
                type: 'success',
            })
        } catch (e) {
            handleFormErrors(e, form.setError)
            toast.add({ title: t('Failed to save changes'), type: 'error' })
            throw e
        }
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={setOpen}>
            <ResponsiveDialogTrigger
                render={
                    <Button>
                        <IconPlus className={'size-4'} /> Add network interface
                    </Button>
                }
            />
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('New Network Interface')}
                    </ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit as any)}>
                        <ResponsiveDialogBody className={'space-y-2'}>
                            <InputForm
                                name={'name'}
                                label={t('Name')}
                                autoComplete={'off'}
                            />
                            <TextareaForm
                                name={'description'}
                                label={t('Description')}
                            />
                            <CheckboxForm
                                name={'isVlanAware'}
                                label={t('VLAN-aware bridge')}
                                description={t(
                                    'Enable this only when the Proxmox bridge has VLAN awareness enabled.'
                                )}
                            />
                            <InputForm
                                name={'vlanTag'}
                                label={t('Default VLAN tag')}
                                type={'number'}
                                min={1}
                                max={4094}
                                disabled={!isVlanAware}
                                description={t(
                                    'Optional. Servers on this interface inherit this tag unless they set an override.'
                                )}
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
                            <FormButton>{t('Add network')}</FormButton>
                        </ResponsiveDialogFooter>
                    </form>
                </Form>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default CreateNetworkModal
