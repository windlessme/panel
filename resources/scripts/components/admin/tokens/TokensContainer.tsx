import { useFlashKey } from '@/util/useFlash'
import usePagination from '@/util/usePagination'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import deleteToken from '@/api/admin/tokens/deleteToken'
import { Token } from '@/api/admin/tokens/getTokens'
import useTokensSWR from '@/api/admin/tokens/useTokensSWR'

import Menu from '@/components/elements/Menu'
import Modal from '@/components/elements/Modal'
import PageContentBlock from '@/components/elements/PageContentBlock'
import Pagination from '@/components/elements/Pagination'
import Spinner from '@/components/elements/Spinner'
import Table, {
    Actions,
    ColumnArray,
    RowActionsProps,
} from '@/components/elements/displays/Table'

import CreateTokenButton from '@/components/admin/tokens/CreateTokenButton'


const TokensContainer = () => {
    const { t } = useTranslation('admin.tokens')
    const { t: tStrings } = useTranslation('strings')
    const [page, setPage] = usePagination()
    const { data, mutate } = useTokensSWR({ page })
    const { clearFlashes, clearAndAddHttpError } = useFlashKey('admin:tokens')

    const columns: ColumnArray<Token> = [
        {
            accessor: 'name',
            header: tStrings('name'),
        },
        {
            accessor: 'user',
            header: tStrings('owner'),
            cell: ({ value }) => (
                <Link
                    to={`/admin/users/${value.id}/settings`}
                    className='link text-foreground'
                >
                    {value.email}
                </Link>
            ),
        },
        {
            accessor: 'lastUsedAt',
            header: t('last_used_at'),
            cell: ({ value }) =>
                value
                    ? formatDistanceToNow(value, {
                          includeSeconds: true,
                          addSuffix: true,
                      })
                    : null,
        },
    ]

    const rowActions = ({ row: token }: RowActionsProps<Token>) => {
        const [open, setOpen] = useState(false)
        const handleDelete = () => {
            clearFlashes()
            setOpen(false)

            deleteToken(token.id)
                .then(() => {
                    mutate(data => {
                        if (!data) return data

                        return {
                            ...data,
                            items: data.items.filter(
                                tokenum => tokenum.id !== token.id
                            ),
                        }
                    })
                })
                .catch(error => {
                    clearAndAddHttpError(error as Error)
                })
        }

        return (
            <>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <Modal.Header>
                        <Modal.Title>
                            {t('delete_modal.title', { name: token.name })}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Modal.Description>
                            {t('delete_modal.description')}
                        </Modal.Description>
                    </Modal.Body>
                    <Modal.Actions>
                        <Modal.Action onClick={() => setOpen(false)}>
                            {tStrings('cancel')}
                        </Modal.Action>
                        <Modal.Action onClick={handleDelete}>
                            {tStrings('delete')}
                        </Modal.Action>
                    </Modal.Actions>
                </Modal>
                <Actions>
                    <Menu.Item color='red' onClick={() => setOpen(true)}>
                        {tStrings('delete')}
                    </Menu.Item>
                </Actions>
            </>
        )
    }

    return (
        <div className='bg-background min-h-screen'>
            <PageContentBlock
                title={tStrings('token_other')}
                showFlashKey='admin:tokens'
            >
                <CreateTokenButton />
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
            </PageContentBlock>
        </div>
    )
}

export default TokensContainer