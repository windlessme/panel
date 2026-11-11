import {
    addressQueries,
    generateAddresses,
} from '@/features/ipam/blocks/addresses/api.ts'
import { addressBlockQueries } from '@/features/ipam/blocks/api.ts'
import { addressCapacity } from '@/features/ipam/capacity.ts'
import { AddressBlock } from '@/types/address-block.ts'
import { PaginatedAddresses } from '@/types/address.ts'
import { Mutator } from '@/types/query.ts'
import { IconPlus } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { t } from '@/lib/i18n.ts'
import { queryClient } from '@/lib/query-client.ts'

import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
    ResponsiveDialog,
    ResponsiveDialogBody,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
    ResponsiveDialogTrigger,
} from '@/components/ui/ResponsiveDialog'
import { toast } from '@/components/ui/Toast'

interface Props {
    block: AddressBlock | undefined
    mutate: Mutator<PaginatedAddresses>
}

/**
 * Generating a block's addresses, with what actually happens on screen.
 *
 * The old control was a bare "Generate IPs" button that fired on click and toasted
 * `createdCount`. `GeneratedAddressesData` also reports `remaining`, `isComplete` and `sparse`,
 * and dropping those three made the action lie in both directions: a large block writes one batch
 * per click with nothing saying thousands are left, and a sparse block — which is minted on
 * demand and has nothing to generate — reported "Generated 0 addresses", which reads as failure.
 */
const GenerateAddressesModal = ({ block, mutate }: Props) => {
    const [open, setOpen] = useState(false)
    const view = block ? addressCapacity(block.capacity) : null

    const { mutate: trigger, isPending } = useMutation({
        mutationFn: () =>
            generateAddresses(block!.addressBlockGroupId, block!.id),
        onSuccess: async result => {
            await mutate()
            await Promise.all([
                // The block's own counts moved, and they are what the header meter draws.
                queryClient.invalidateQueries({
                    queryKey: addressBlockQueries.detail(
                        block!.addressBlockGroupId,
                        block!.id
                    ).queryKey,
                }),
                /*
                 * Generation is the one action that turns ungenerated cells into addresses, so the
                 * grid is exactly what the reader is watching while it runs. `all` covers both the
                 * list and the map.
                 */
                queryClient.invalidateQueries({
                    queryKey: addressQueries.all(
                        block!.addressBlockGroupId,
                        block!.id
                    ),
                }),
            ])

            setOpen(false)

            if (result.sparse) {
                toast.add({
                    title: t('Nothing to generate'),
                    description: t(
                        'This block is minted on demand — addresses are created as they are allocated.'
                    ),
                    type: 'info',
                })

                return
            }

            toast.add({
                title: t('Generated {{count, number}} addresses', {
                    count: result.createdCount,
                }),
                description: result.isComplete
                    ? t('Every address in this block now exists.')
                    : t('{{remaining}} left — run it again to continue.', {
                          remaining: result.remaining.toLocaleString(),
                      }),
                type: 'success',
            })
        },
        onError: () => {
            toast.add({
                title: t('Failed to generate addresses'),
                type: 'error',
            })
        },
    })

    if (!block || !view) {
        return null
    }

    const cidr = `${block.baseIp}/${block.prefixLengthFrom}`
    const nothingToDo = view.isSparse || view.ungenerated < 1

    return (
        <ResponsiveDialog open={open} onOpenChange={setOpen}>
            <ResponsiveDialogTrigger
                render={
                    <Button
                        variant={'outline'}
                        icon={<IconPlus className={'size-4'} />}
                        disabled={nothingToDo}
                    >
                        {t('Generate addresses')}
                    </Button>
                }
            />
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Generate addresses')}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {t('Create the address rows this block can hand out.')}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <ResponsiveDialogBody className={'flex flex-col gap-4'}>
                    <p className={'text-sm'}>
                        <span className={'font-mono'}>{cidr}</span>{' '}
                        {t(
                            'handed out as /{{prefix}} covers {{count, number}} addresses.',
                            {
                                prefix: block.prefixLengthTo,
                                count: view.total ?? 0,
                            }
                        )}{' '}
                        {view.total === view.ungenerated
                            ? t('None exist yet.')
                            : t('{{count, number}} exist so far.', {
                                  count: view.total! - view.ungenerated,
                              })}
                    </p>
                    <Alert>
                        <AlertDescription>
                            {t(
                                'Addresses are written in batches, so a block this size may need more than one run. Each run reports how many are left.'
                            )}
                        </AlertDescription>
                    </Alert>
                    <dl className={'grid grid-cols-3 gap-3'}>
                        <div className={'flex flex-col-reverse'}>
                            <dt className={'text-muted-foreground text-xs'}>
                                {t('Covers')}
                            </dt>
                            <dd className={'font-mono text-sm'}>
                                {(view.total ?? 0).toLocaleString()}
                            </dd>
                        </div>
                        <div className={'flex flex-col-reverse'}>
                            <dt className={'text-muted-foreground text-xs'}>
                                {t('To create')}
                            </dt>
                            <dd className={'font-mono text-sm'}>
                                {view.ungenerated.toLocaleString()}
                            </dd>
                        </div>
                        <div className={'flex flex-col-reverse'}>
                            <dt className={'text-muted-foreground text-xs'}>
                                {t('Gateway')}
                            </dt>
                            <dd className={'font-mono text-sm'}>
                                {block.gateway ?? '—'}
                            </dd>
                        </div>
                    </dl>
                    <p className={'text-muted-foreground text-xs'}>
                        {t(
                            'The network, broadcast and gateway addresses are created reserved — they exist so nothing else can take them, and they cannot be released.'
                        )}
                    </p>
                </ResponsiveDialogBody>
                <ResponsiveDialogFooter className={'sm:mt-4'}>
                    <ResponsiveDialogClose
                        render={
                            <Button variant={'outline'} type={'button'}>
                                {t('Cancel')}
                            </Button>
                        }
                    />
                    <Button onClick={() => trigger()} loading={isPending}>
                        {t('Generate')}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default GenerateAddressesModal
