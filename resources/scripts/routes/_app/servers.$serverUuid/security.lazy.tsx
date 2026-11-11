import PasswordCard from '@/features/servers/security/components/PasswordCard.tsx'
import SSHKeysCard from '@/features/servers/security/components/SSHKeysCard.tsx'
import { createLazyFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import Heading from '@/components/ui/Typography/Heading.tsx'

export const Route = createLazyFileRoute('/_app/servers/$serverUuid/security')({
    component: ServerSecurity,
    // @ts-ignore
    meta: () => [{ title: t('Security') }],
})

function ServerSecurity() {
    const { serverUuid } = Route.useParams()

    return (
        <>
            <Heading>{t('Security')}</Heading>
            <div className={'grid grid-cols-1 gap-2 @md:grid-cols-2 @md:gap-4'}>
                <SSHKeysCard uuid={serverUuid} />
                <PasswordCard uuid={serverUuid} />
            </div>
        </>
    )
}
