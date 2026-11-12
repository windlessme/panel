import { useFlashKey } from '@/util/useFlash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import deleteNode from '@/api/admin/nodes/deleteNode'
import useNodeSWR from '@/api/admin/nodes/useNodeSWR'

import Button from '@/components/elements/Button'
import FlashMessageRender from '@/components/elements/FlashMessageRenderer'
import FormCard from '@/components/elements/FormCard'
import MessageBox from '@/components/elements/MessageBox'


const DeleteNodeCard = () => {
    const { t } = useTranslation('admin.nodes.index')
    const { t: tStrings } = useTranslation('strings')
    const { data: node } = useNodeSWR()
    const { clearFlashes, clearAndAddHttpError } = useFlashKey(
        `admin.nodes.${node.id}.settings.general.delete`
    )
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        clearFlashes()
        setLoading(true)
        try {
            await deleteNode(node.id)

            navigate('/admin/nodes')
        } catch (error) {
            clearAndAddHttpError(error as Error)
        }
        setLoading(false)
    }

    return (
        <FormCard className='w-full border-error'>
            <FormCard.Body>
                <FormCard.Title>{t('delete_node.title')}</FormCard.Title>
                <div className='space-y-3 mt-3'>
                    <FlashMessageRender
                        byKey={`admin.nodes.${node.id}.settings.general.delete`}
                    />

                    <p className='description-small my-3'>
                        {t('delete_node.description')}
                    </p>

                    {node.serversCount > 0 && (
                        <MessageBox title={tStrings('error')} type='error'>
                            {t('delete_node.has_servers_error')}
                        </MessageBox>
                    )}
                </div>
            </FormCard.Body>
            <FormCard.Footer>
                <Button
                    onClick={handleDelete}
                    loading={loading}
                    disabled={node.serversCount > 0}
                    type='submit'
                    variant='filled'
                    color='danger'
                    size='sm'
                >
                    {tStrings('delete')}
                </Button>
            </FormCard.Footer>
        </FormCard>
    )
}

export default DeleteNodeCard