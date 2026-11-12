import { useTranslation } from 'react-i18next'

import SettingsLayout from '@/components/elements/layouts/SettingsLayout'

import ServerContentBlock from '@/components/servers/ServerContentBlock'


const ServerSettingsContainer = () => {
    const { t } = useTranslation('server.settings')
    const { t: tStrings } = useTranslation('strings')

    return (
        <SettingsLayout
            indexPattern='/servers/:id/settings'
            defaultUrl='/servers/:id/settings/general'
            contentBlock={props => (
                <ServerContentBlock
                    title={t('title')}
                    showFlashKey='server:settings'
                    {...props}
                />
            )}
            routes={[
                {
                    path: '/servers/:id/settings/general',
                    name: tStrings('general'),
                },
                {
                    path: '/servers/:id/settings/hardware',
                    name: tStrings('hardware'),
                },
                {
                    path: '/servers/:id/settings/network',
                    name: tStrings('network'),
                },
                {
                    path: '/servers/:id/settings/security',
                    name: tStrings('security'),
                },
            ]}
        />
    )
}

export default ServerSettingsContainer