import { useFlashKey } from '@/util/useFlash'
import usePagination from '@/util/usePagination'
import { FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import createToken from '@/api/admin/tokens/createToken'
import { Token, TokenResponse } from '@/api/admin/tokens/getTokens'
import useTokensSWR from '@/api/admin/tokens/useTokensSWR'

import Button from '@/components/elements/Button'
import FlashMessageRender from '@/components/elements/FlashMessageRenderer'
import Modal from '@/components/elements/Modal'
import TextInputFormik from '@/components/elements/formik/TextInputFormik'

import PlainTextTokenModal from '@/components/admin/tokens/PlainTextTokenModal'


const CreateTokenButton = () => {
    const { t } = useTranslation('admin.tokens')
    const { t: tStrings } = useTranslation('strings')
    const [open, setOpen] = useState(false)
    const [page] = usePagination()
    const { clearFlashes, clearAndAddHttpError } = useFlashKey(
        'admin:tokens.create'
    )
    const { mutate } = useTokensSWR({ page })
    const [token, setToken] = useState<Token | null>(null)

    const form = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: yup.object({
            name: yup
                .string()
                .max(191, t('validation.name_max', { max: 191 }))
                .required(t('validation.name_required')),
        }),
        onSubmit: async values => {
            clearFlashes()
            try {
                const { plainTextToken, ...token } = await createToken(values)

                mutate(data => {
                    if (!data) return data

                    return {
                        ...data,
                        items: [token, ...data.items],
                    } as TokenResponse
                }, false)

                setToken({ plainTextToken, ...token })

                handleClose()
            } catch (e) {
                clearAndAddHttpError(e as Error)
            }
        },
    })

    const handleClose = () => {
        clearFlashes()
        form.resetForm()
        setOpen(false)
    }

    return (
        <div className='flex justify-end items-center mb-3'>
            <Button onClick={() => setOpen(true)} variant='filled'>
                {t('new_token')}
            </Button>
            <PlainTextTokenModal value={token} onClose={() => setToken(null)} />
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>{t('create_modal.title')}</Modal.Title>
                </Modal.Header>

                <FormikProvider value={form}>
                    <form onSubmit={form.handleSubmit}>
                        <Modal.Body>
                            <FlashMessageRender
                                className='mb-5'
                                byKey={'admin:tokens.create'}
                            />
                            <TextInputFormik
                                name={'name'}
                                label={tStrings('name')}
                            />
                        </Modal.Body>
                        <Modal.Actions>
                            <Modal.Action type='button' onClick={handleClose}>
                                {tStrings('cancel')}
                            </Modal.Action>
                            <Modal.Action
                                type='submit'
                                loading={form.isSubmitting}
                            >
                                {tStrings('create')}
                            </Modal.Action>
                        </Modal.Actions>
                    </form>
                </FormikProvider>
            </Modal>
        </div>
    )
}

export default CreateTokenButton