import {
    AddressBlockGroupQueryParams,
    useAddressBlockGroups,
} from '@/features/ipam/api.ts'
import useDataTable from '@/hooks/use-data-table.ts'
import { AddressBlockGroup } from '@/types/address-block-group.ts'
import { cn } from '@/utils'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge.tsx'
import { buttonVariants } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/Item'
import { Heading } from '@/components/ui/Typography'

export const Route = createLazyFileRoute('/_app/admin/nodes/$nodeId/ipam')({
    component: NodeIpam,
})

function NodeIpam() {
    const { nodeId } = Route.useParams()
    const numericNodeId = Number(nodeId)
    const { queryParams, tableProps } = useDataTable()
    const scopedQueryParams: AddressBlockGroupQueryParams = {
        ...queryParams,
        filters: {
            ...queryParams.filters,
            node_id: numericNodeId,
        },
    }
    const { data, isPlaceholderData, isError, refetch } =
        useAddressBlockGroups(scopedQueryParams)

    const columns: ColumnDef<AddressBlockGroup>[] = [
        {
            header: t('IP Block Group'),
            accessorKey: 'name',
            enableHiding: false,
            meta: {
                skeletonWidth: '5rem',
            },
            cell: ({ cell }) => (
                <Link
                    className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
                    to='/admin/ipam/$addressBlockGroupId'
                    params={{
                        addressBlockGroupId: String(cell.row.original.id),
                    }}
                >
                    {cell.getValue<string>()}
                </Link>
            ),
        },
        {
            header: t('Description'),
            accessorKey: 'description',
            meta: {
                skeletonWidth: '10rem',
            },
        },
        {
            header: t('IP Blocks'),
            accessorKey: 'addressBlocksCount',
            meta: {
                skeletonWidth: '1rem',
                align: 'center',
            },
            cell: ({ cell }) => (
                <Badge variant={'secondary'} className={'font-mono'}>
                    {cell.getValue<number>()}
                </Badge>
            ),
        },
        {
            header: t('Nodes'),
            accessorKey: 'nodesCount',
            meta: {
                skeletonWidth: '1rem',
                align: 'center',
            },
            cell: ({ cell }) => (
                <Badge variant={'secondary'} className={'font-mono'}>
                    {cell.getValue<number>()}
                </Badge>
            ),
        },
    ]

    return (
        <>
            <Heading>{t('IPAM')}</Heading>
            <DataTable
                paginated
                searchable
                toolbar
                data={data}
                columns={columns}
                isPlaceholderData={isPlaceholderData}
                isError={isError}
                onRetry={refetch}
                mobileRow={row => {
                    const group = row.original

                    return (
                        <Item variant={'muted'} size={'sm'}>
                            <ItemContent
                                className={'min-w-0 overflow-x-hidden'}
                            >
                                <ItemTitle className={'w-full min-w-0'}>
                                    {/* buttonVariants is inline-flex shrink-0, so
                                        `truncate` on the link itself neither shrinks
                                        nor ellipsises — the text has to truncate in
                                        an inner span. */}
                                    <Link
                                        className={cn(
                                            buttonVariants({ variant: 'link' }),
                                            'h-auto max-w-full min-w-0 shrink p-0'
                                        )}
                                        to='/admin/ipam/$addressBlockGroupId'
                                        params={{
                                            addressBlockGroupId: String(
                                                group.id
                                            ),
                                        }}
                                    >
                                        <span className={'truncate'}>
                                            {group.name}
                                        </span>
                                    </Link>
                                </ItemTitle>
                                <ItemDescription
                                    className={'block truncate text-nowrap'}
                                >
                                    {group.description || t('No description')}
                                </ItemDescription>
                                <div className={'flex flex-wrap gap-2'}>
                                    <Badge
                                        variant={'secondary'}
                                        className={'w-fit'}
                                    >
                                        {t('{{count}} IP blocks', {
                                            count: group.addressBlocksCount,
                                        })}
                                    </Badge>
                                    <Badge
                                        variant={'secondary'}
                                        className={'w-fit'}
                                    >
                                        {t('{{count}} nodes', {
                                            count: group.nodesCount,
                                        })}
                                    </Badge>
                                </div>
                            </ItemContent>
                        </Item>
                    )
                }}
                {...tableProps}
            />
        </>
    )
}
