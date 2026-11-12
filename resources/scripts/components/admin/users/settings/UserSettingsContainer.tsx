import { useTranslation } from 'react-i18next'

import SettingsLayout from '@/components/elements/layouts/SettingsLayout'

import UserContentBlock from '@/components/admin/users/UserContentBlock'

const UserSettingsContainer = () => {
    const { t } = useTranslation('admin.users')
    const { t: tStrings } = useTranslation('strings')

    return (
        <SettingsLayout
            indexPattern='/admin/users/:id/settings'
            defaultUrl='/admin/users/:id/settings/general'
            contentBlock={props => (
                <UserContentBlock
                    title={t('settings_title')}
                    showFlashKey='admin:user:settings'
                    {...props}
                />
            )}
            routes={[
                {
                    path: '/admin/users/:id/settings/general',
                    name: tStrings('general'),
                },
            ]}
        />
    )
}

export default UserSettingsContainer