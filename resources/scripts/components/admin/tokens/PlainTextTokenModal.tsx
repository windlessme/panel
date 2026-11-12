import { Code } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { Token } from '@/api/admin/tokens/getTokens'

import Modal from '@/components/elements/Modal'

interface Props {
    value: Token | null
    onClose: () => void
}

const PlainTextTokenModal = ({ value, onClose }: Props) => {
    const { t } = useTranslation('admin.tokens')

    return (
        <Modal open={Boolean(value)} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>{t('created_modal.title')}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Modal.Description>
                    {t('created_modal.description')}
                </Modal.Description>

                <Code className={'!mt-3'} block color={'blue'}>
                    {value?.plainTextToken}
                </Code>
            </Modal.Body>
            <Modal.Actions>
                <Modal.Action onClick={onClose}>
                    {t('created_modal.button')}
                </Modal.Action>
            </Modal.Actions>
        </Modal>
    )
}

export default PlainTextTokenModal