import { useFlashKey } from '@/util/useFlash'
import usePagination from '@/util/usePagination'
import { FormikProvider, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import createUser from '@/api/admin/users/createUser'
import { UserResponse } from '@/api/admin/users/getUsers'
import useUsersSWR from '@/api/admin/users/useUsersSWR'

import FlashMessageRender from '@/components/elements/FlashMessageRenderer'
import MessageBox from '@/components/elements/MessageBox'
import Modal from '@/components/elements/Modal'
import CheckboxFormik from '@/components/elements/formik/CheckboxFormik'
import TextInputFormik from '@/components/elements/formik/TextInputFormik'


interface Props {
    open: boolean
    onClose: () => void
}

const CreateUserButton = ({ open, onClose }: Props) => {
    const { t } = useTranslation('admin.users')
    const { t: tStrings } = useTranslation('strings')
    const [page] = usePagination()
    const { clearFlashes, clearAndAddHttpError } =
        useFlashKey('admin:users.create')
    const { mutate } = useUsersSWR({ page })

    const form = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            rootAdmin: false,
        },
        validationSchema: yup.object({
            name: yup
                .string()
                .max(191, t('validation.name_max', { max: 191 }))
                .required(t('validation.name_required')),
            email: yup
                .string()
                .email(t('validation.email_invalid'))
                .required(t('validation.email_required')),
            password: yup
                .string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    t('validation.password_rules')
                )
                .required(t('validation.password_required')),
            rootAdmin: yup.boolean(),
        }),
        onSubmit: async values => {
            clearFlashes()
            try {
                const user = await createUser(values)

                mutate(data => {
                    if (!data) return data

                    return {
                        ...data,
                        items: [user, ...data.items],
                    } as UserResponse
                }, false)

                handleClose()
            } catch (e) {
                clearAndAddHttpError(e as Error)
            }
        },
    })

    const handleClose = () => {
        clearFlashes()
        form.resetForm()
        onClose()
    }

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>{t('create_modal.title')}</Modal.Title>
                </Modal.Header>

                <FormikProvider value={form}>
                    <form onSubmit={form.handleSubmit}>
                        <Modal.Body>
                            <FlashMessageRender
                                className='mb-5'
                                byKey={'admin:users.create'}
                            />
                            <TextInputFormik
                                name={'name'}
                                label={tStrings('name')}
                            />
                            <TextInputFormik
                                name={'email'}
                                label={tStrings('email')}
                            />
                            <TextInputFormik
                                name={'password'}
                                label={tStrings('password')}
                                type={'password'}
                            />
                            <CheckboxFormik
                                name={'rootAdmin'}
                                label={tStrings('administrator')}
                                className={'mt-3 relative'}
                            />
                            {form.values.rootAdmin && (
                                <MessageBox
                                    type={'warning'}
                                    title={tStrings('warning')}
                                >
                                    {t('create_modal.is_admin_warning')}
                                </MessageBox>
                            )}
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
        </>
    )
}

export default CreateUserButton