import { bytesToString } from '@/util/helpers'
import usePagination from '@/util/usePagination'
import {
    ExclamationCircleIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/20/solid'
import { Loader } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import deleteIso from '@/api/admin/nodes/isos/deleteIso'
import { ISO, IsoResponse } from '@/api/admin/nodes/isos/getIsos'
import useIsosSWR from '@/api/admin/nodes/isos/useIsosSWR'
import useNodeSWR from '@/api/admin/nodes/useNodeSWR'

import Button from '@/components/elements/Button'
import Menu from '@/components/elements/Menu'
import Pagination from '@/components/elements/Pagination'
import Spinner from '@/components/elements/Spinner'
import Table, {
    Actions,
    ColumnArray,
    RowActionsProps,
} from '@/components/elements/displays/Table'

import NodeContentBlock from '@/components/admin/nodes/NodeContentBlock'
import CreateIsoModal from '@/components/admin/nodes/isos/CreateIsoModal'
import EditIsoModal from '@/components/admin/nodes/isos/EditIsoModal'


const IsosContainer = () => {
    const { data: node } = useNodeSWR()
    const [page, setPage] = usePagination()
    const { data, mutate } = useIsosSWR({ nodeId: node.id })
    const [showCreateModal, setShowCreateModal] = useState(false)
    const { t } = useTranslation('admin.nodes.isos')
    const { t: tStrings } = useTranslation('strings')

    const columns: ColumnArray<ISO> = [
        {
            accessor: 'name',
            header: tStrings('name'),
            cell: ({ value, row }) => (
                <div className='flex space-x-3 items-center'>
                    <span>{value}</span>
                    {row.completedAt === undefined ? (
                        <Loader size='sm' />
                    ) : !row.isSuccessful ? (
                        <ExclamationCircleIcon className='h-5 w-5 text-error' />
                    ) : null}
                </div>
            ),
        },
        {
            accessor: 'uuid',
            header: 'UUID',
        },
        {
            accessor: 'fileName',
            header: tStrings('file_name'),
        },
        {
            accessor: 'hidden',
            header: tStrings('visibility'),
            cell: ({ value }) => (
                <div className='grid place-items-center'>
                    {value ? (
                        <EyeSlashIcon
                            title={tStrings('hidden')}
                            className='h-5 w-5 text-foreground'
                        />
                    ) : (
                        <EyeIcon
                            title={tStrings('visible')}
                            className='h-5 w-5 text-foreground'
                        />
                    )}
                </div>
            ),
            align: 'center',
        },
        {
            accessor: 'size',
            header: tStrings('size'),
            cell: ({ value }) => bytesToString(value),
        },
    ]

    const rowActions = ({ row: iso }: RowActionsProps<ISO>) => {
        const [open, setOpen] = useState(false)

        const handleDelete = () => {
            deleteIso(node.id, iso.uuid).then(() => {
                mutate(
                    mutateData =>
                        ({
                            ...mutateData,
                            items: mutateData!.items.filter(
                                datum => datum.uuid !== iso.uuid
                            ),
                        }) as IsoResponse,
                    false
                )
            })
        }
        return (
            <>
                <EditIsoModal
                    open={open}
                    onClose={() => setOpen(false)}
                    iso={iso}
                />
                <Actions>
                    <Menu.Item onClick={() => setOpen(true)}>
                        {tStrings('edit')}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color='red' onClick={handleDelete}>
                        {tStrings('delete')}
                    </Menu.Item>
                </Actions>
            </>
        )
    }

    return (
        <div className='bg-background min-h-screen'>
            <NodeContentBlock title={t('iso_library')}>
                <CreateIsoModal
                    open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    mutate={mutate}
                />
                <div className='flex justify-end items-center mb-3'>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        variant='filled'
                    >
                        {t('create_iso')}
                    </Button>
                </div>
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

export default IsosContainer