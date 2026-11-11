import { useFormContext, useWatch } from 'react-hook-form'

import { t } from '@/lib/i18n.ts'

import { InputForm, SelectForm } from '@/components/ui/Forms'

/**
 * The concrete half of an overage penalty: the action, plus a rate when the
 * action is a throttle. Split out from {@see OveragePenaltyFields} because the
 * global tier has nothing to inherit from and so renders these directly.
 */
const PenaltyActionFields = () => {
    const { control } = useFormContext()
    const action = useWatch({ control, name: 'overagePenaltyAction' })

    return (
        <div className={'space-y-3'}>
            <SelectForm
                name={'overagePenaltyAction'}
                label={t('Action')}
                items={[
                    { value: 'throttle', label: 'Throttle to rate' },
                    { value: 'disconnect', label: 'Disconnect NIC' },
                ]}
                description={
                    action === 'disconnect'
                        ? t(
                              'The guest keeps its NIC but loses carrier until the quota resets. Reversible, but it drops all traffic.'
                          )
                        : t(
                              'Caps every NIC on the server at the rate below once its quota is used up.'
                          )
                }
            />

            {action === 'throttle' && (
                <InputForm
                    name={'overagePenaltyRate'}
                    label={t('Rate (MB/s)')}
                    type={'number'}
                    inputMode={'numeric'}
                />
            )}
        </div>
    )
}

export default PenaltyActionFields
