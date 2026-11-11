import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'

import { t } from '@/lib/i18n.ts'

import { FormFieldContext } from '@/components/ui/Form/form-field-provider.tsx'

import { FormItemContext } from './form-item-provider'

const useFormField = () => {
    const fieldContext = useContext(FormFieldContext)
    const itemContext = useContext(FormItemContext)
    const { getFieldState, formState } = useFormContext()

    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>')
    }

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: t('{{id}}-form-item', { id }),
        formDescriptionId: t('{{id}}-form-item-description', { id }),
        formMessageId: t('{{id}}-form-item-message', { id }),
        ...fieldState,
    }
}

export default useFormField
