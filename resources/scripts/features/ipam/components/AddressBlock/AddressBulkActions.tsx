import {
    AddressBulkAction,
    bulkAddresses,
} from '@/features/ipam/blocks/addresses/api.ts'
import { addressBlockQueries } from '@/features/ipam/blocks/api.ts'
import { AddressStateKind } from '@/features/ipam/components/AddressStateLabel.tsx'
import { PaginatedAddresses } from '@/types/address.ts'
import { Mutator } from '@/types/query.ts'
import { useMutation } from '@tanstack/react-query'

import { t } from '@/lib/i18n.ts'
import { queryClient } from '@/lib/query-client.ts'

import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

/**
 * The selection, reduced to what the actions need.
 *
 * Both callers select the same things by different routes — checkboxes in the table, cells on the
 * map — and neither has a reason to hand over whole address records just so this can re-derive a
 * state it was already told.
 */
export interface AddressSelection {
    id: number
    kind: AddressStateKind
}

interface Props {
    selection: AddressSelection[]
    addressBlockGroupId: number
    addressBlockId: number
    mutate: Mutator<PaginatedAddresses>
}

const VERBS: Record<
    AddressBulkAction,
    { done: (count: number) => string; none: string }
> = {
    reserve: {
        done: count => t('{{count, number}} addresses reserved', { count }),
        none: t('None of those could be reserved'),
    },
    release: {
        done: count => t('{{count, number}} addresses released', { count }),
        none: t('None of those could be released'),
    },
    delete: {
        done: count => t('{{count, number}} addresses deleted', { count }),
        none: t('None of those could be deleted'),
    },
}

/**
 * The buttons inside the table's selection bar.
 *
 * Reserving a run of infrastructure addresses used to be one trip through a row menu per address —
 * and one audit entry per address. Which buttons appear follows the selection: there is no point
 * offering Release when nothing selected is held.
 */
const AddressBulkActions = ({
    selection,
    addressBlockGroupId,
    addressBlockId,
    mutate,
}: Props) => {
    const { mutate: run, isPending } = useMutation({
        mutationFn: ({ action }: { action: AddressBulkAction }) =>
            bulkAddresses(
                addressBlockGroupId,
                addressBlockId,
                action,
                selection.map(entry => entry.id)
            ),
        onSuccess: async result => {
            await mutate()
            // The block's counts moved, and they are what the header meter draws.
            await queryClient.invalidateQueries({
                queryKey: addressBlockQueries.detail(
                    addressBlockGroupId,
                    addressBlockId
                ).queryKey,
            })

            const verb = VERBS[result.action]

            toast.add({
                title:
                    result.affected > 0
                        ? verb.done(result.affected)
                        : verb.none,
                // Skipped rows are the normal case, not an error: a selection dragged over a table
                // will contain system reservations and assigned addresses, and saying nothing about
                // them leaves the operator counting rows to work out what happened.
                description:
                    result.skipped > 0
                        ? t(
                              '{{skipped}} skipped — assigned or reserved by the panel.',
                              { skipped: result.skipped.toLocaleString() }
                          )
                        : undefined,
                type: result.affected > 0 ? 'success' : 'info',
            })
        },
        onError: () =>
            toast.add({ title: t('Bulk action failed'), type: 'error' }),
    })

    const canReserve = selection.some(entry => entry.kind === 'available')
    const canRelease = selection.some(entry => entry.kind === 'reserved')
    const canDelete = selection.some(entry => entry.kind !== 'assigned')

    /*
     * A selection can be legal to make and have nothing legal to do — every address in it is
     * assigned, say. Rendering nothing leaves "6 selected" sitting beside an empty space, which
     * reads as a broken toolbar rather than the rule it is.
     */
    if (!canReserve && !canRelease && !canDelete) {
        return (
            <span className={'text-muted-foreground text-sm'}>
                {selection.length > 0
                    ? t(
                          'Nothing to do — unassign these from their servers first.'
                      )
                    : t('Nothing selected.')}
            </span>
        )
    }

    return (
        <>
            {canReserve && (
                <Button
                    size={'sm'}
                    variant={'outline'}
                    loading={isPending}
                    onClick={() => run({ action: 'reserve' })}
                >
                    {t('Reserve')}
                </Button>
            )}
            {canRelease && (
                <Button
                    size={'sm'}
                    variant={'outline'}
                    loading={isPending}
                    onClick={() => run({ action: 'release' })}
                >
                    {t('Release')}
                </Button>
            )}
            {canDelete && (
                <Button
                    size={'sm'}
                    variant={'destructive'}
                    loading={isPending}
                    onClick={() => run({ action: 'delete' })}
                >
                    {t('Delete')}
                </Button>
            )}
        </>
    )
}

export default AddressBulkActions
