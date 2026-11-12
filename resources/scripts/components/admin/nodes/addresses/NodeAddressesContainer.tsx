import usePagination from '@/util/usePagination'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import useAddressesSWR from '@/api/admin/nodes/addresses/useAddressesSWR'
import useNodeSWR from '@/api/admin/nodes/useNodeSWR'
import { Address } from '@/api/server/getServer'

import Menu from '@/components/elements/Menu'
import Pagination from '@/components/elements/Pagination'
import Spinner from '@/components/elements/Spinner'
import Table, {
    Actions,
    ColumnArray,
    RowActionsProps,
} from '@/components/elements/displays/Table'

import EditAddressModal from '@/components/admin/ipam/addresses/EditAddressModal'
import NodeContentBlock from '@/components/admin/nodes/NodeContentBlock'
import DeleteAddressModal from '@/components/admin/nodes/addresses/DeleteAddressModal'


const NodeAddressesContainer = () => {
    const { t: tStrings } = useTranslation('strings')
    const { data: node } = useNodeSWR()
    const [page, setPage] = usePagination()
    const { mutate, data } = useAddressesSWR(node.id, {
        page,
        include: ['server'],
    })

    const columns: ColumnArray<Address> = [
        {
            accessor: 'address',
            header: tStrings('address_one'),
        },
        {
            accessor: 'cidr',
            header: tStrings('cidr'),
        },
        {
            accessor: 'gateway',
            header: tStrings('gateway'),
        },
        {
            accessor: 'macAddress',
            header: tStrings('mac_address'),
        },
        {
            accessor: 'type',
            header: tStrings('type'),
        },
        {
            accessor: 'server',
            header: tStrings('server'),
            cell: ({ value }) =>
                value ? (
                    <Link
                        to={`/admin/servers/${value.id}`}
                        className='link text-foreground'
                    >
                        {value.hostname}
                    </Link>
                ) : null,
        },
    ]

    const rowActions = ({ row }: RowActionsProps<Address>) => {
        const [showEditModal, setShowEditModal] = useState(false)
        const [showDeleteModal, setShowDeleteModal] = useState(false)

        return (
            <>
                <EditAddressModal
                    address={showEditModal ? row : null}
                    onClose={() => setShowEditModal(false)}
                    mutate={mutate}
                />
                <DeleteAddressModal
                    address={row}
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                />
                <Actions>
                    <Menu.Item onClick={() => setShowEditModal(true)}>
                        {tStrings('edit')}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        color='red'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        {tStrings('delete')}
                    </Menu.Item>
                </Actions>
            </>
        )
    }

    return (
        <div className='bg-background min-h-screen'>
            <NodeContentBlock title={tStrings('address_other')}>
                {!data ? (
                    <Spinner />
                ) : (
                    <Pagination data={data} onPageSelect={setPage}>
                        {({ items }) => (
                            <Table
                                rowActions={rowActions}
                                columns={columns}
                                data={items}
                            />
                        )}
                    </Pagination>
                )}
            </NodeContentBlock>
        </div>
    )
}

export default NodeAddressesContainer
