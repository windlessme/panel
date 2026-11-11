import { useIsAuthenticatorEnabled } from '@/features/account/authenticator/api.ts'
import { IconAsteriskSimple, IconDeviceMobileFilled } from '@tabler/icons-react'

import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge'
import { SimpleEmptyState } from '@/components/ui/EmptyStates'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/Item'
import Skeleton from '@/components/ui/Skeleton.tsx'

/**
 * The body of the Authenticator dialog: what state the account is in, and
 * nothing else.
 *
 * The enabled state used to be a bare <p>Authenticator is enabled</p> above a
 * hand-spaced `mt-3 flex justify-end` button row — the only place in the dialog
 * family that put its actions in the body instead of a footer, which is what
 * made it read as unfinished. Actions now live in AuthenticatorMainDialog's
 * ResponsiveDialogFooter, and the status is an `Item` row, the same primitive a
 * passkey renders as one dialog over.
 */
const AuthenticatorStatus = () => {
    const { data: isEnabled, isLoading } = useIsAuthenticatorEnabled()

    if (isLoading) {
        return <Skeleton className={'h-24 w-full'} />
    }

    if (!isEnabled) {
        return (
            <SimpleEmptyState
                icon={IconAsteriskSimple}
                title={t('Authenticator is disabled')}
                description={t(
                    'You have not enabled the authenticator for your account.'
                )}
            />
        )
    }

    return (
        <Item variant={'muted'} size={'sm'}>
            <ItemMedia variant={'icon'}>
                <IconDeviceMobileFilled />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>
                    {t('Authenticator app')}
                    <Badge variant={'secondary'}>{t('Enabled')}</Badge>
                </ItemTitle>
                <ItemDescription>
                    {t(
                        'A code from your app is required when you sign in with your password.'
                    )}
                </ItemDescription>
            </ItemContent>
        </Item>
    )
}

export default AuthenticatorStatus
