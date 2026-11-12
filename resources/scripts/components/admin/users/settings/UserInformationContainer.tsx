import { useFlashKey } from '@/util/useFlash'
import { FormikProvider, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import updateUser from '@/api/admin/users/updateUser'
import useUserSWR from '@/api/admin/users/useUserSWR'

import Button from '@/components/elements/Button'
import FlashMessageRender from '@/components/elements/FlashMessageRenderer'
import FormCard from '@/components/elements/FormCard'
import CheckboxFormik from '@/components/elements/formik/CheckboxFormik'
import TextInputFormik from '@/components/elements/formik/TextInputFormik'


const UserInformationContainer = () => {
    const { t } = useTranslation('admin.users')
    const { t: tStrings } = useTranslation('strings')
    const { data: user, mutate } = useUserSWR()
    const { clearFlashes, clearAndAddHttpError } = useFlashKey(
        'admin:user:settings:general'
    )

    const form = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user.name,
            email: user.email,
            password: '',
            rootAdmin: user.rootAdmin,
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
                .optional(),
            rootAdmin: yup.boolean(),
        }),
        onSubmit: async ({ password, ...values }) => {
            clearFlashes()
            try {
                const updatedUser = await updateUser(user.id, {
                    ...values,
                    password: password.length > 0 ? password : null,
                })

                mutate(updatedUser, false)
            } catch (e) {
                clearAndAddHttpError(e as Error)
            }
        },
    })

    return (
        <FormCard className='w-full'>
            <FormikProvider value={form}>
                <form onSubmit={form.handleSubmit}>
                    <FormCard.Body>
                        <FormCard.Title>{t('user_info.title')}</FormCard.Title>
                        <div className='space-y-3 mt-3'>
                            <FlashMessageRender byKey='admin:user:settings:general' />
                            <TextInputFormik
                                name='name'
                                label={tStrings('name')}
                            />
                            <TextInputFormik
                                name='email'
                                label={tStrings('email')}
                            />
                            <TextInputFormik
                                name='password'
                                label={tStrings('password')}
                                placeholder={t('user_info.override_pass')}
                            />
                            <CheckboxFormik
                                name={'rootAdmin'}
                                label={tStrings('administrator')}
                                className={'mt-3'}
                            />
                        </div>
                    </FormCard.Body>
                    <FormCard.Footer>
                        <Button
                            loading={form.isSubmitting}
                            disabled={!form.dirty}
                            type='submit'
                            variant='filled'
                            color='success'
                            size='sm'
                        >
                            {tStrings('save')}
                        </Button>
                    </FormCard.Footer>
                </form>
            </FormikProvider>
        </FormCard>
    )
}

export default UserInformationContainer