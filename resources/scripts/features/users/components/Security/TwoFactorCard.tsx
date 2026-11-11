import { useUser, userQueries } from '@/features/users/api.ts'
import CredentialCard from '@/features/users/components/Security/CredentialCard.tsx'
import CredentialRow from '@/features/users/components/Security/CredentialRow.tsx'
import { disableUserTwoFactor } from '@/features/users/credentials/api.ts'
import { IconShieldLock } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import { t } from '@/lib/i18n.ts'
import { queryClient } from '@/lib/query-client.ts'

import useConfirmationStore from '@/components/ui/AlertDialog/use-confirmation-store.ts'
import { toast } from '@/components/ui/Toast'

interface Props {
    userId: number
}

/**
 * Two-factor as a list of one, in the same `CredentialCard` shell as the passkeys and keys beside
 * it: enabled means one row with a remove action, and not-enabled means the card's own empty state.
 *
 * The disable is the lockout-recovery control — for someone who has lost the device and cannot get
 * far enough into the panel to clear it themselves. There is deliberately no way to turn it *on*
 * from here: an admin cannot scan someone else's QR code, and a second factor nobody holds is
 * worse than none.
 */
const TwoFactorCard = ({ userId }: Props) => {
    const confirm = useConfirmationStore(state => state.confirm)
    const { data: user, isLoading, isError, refetch } = useUser(userId)

    const { mutate: disable } = useMutation({
        mutationFn: () => disableUserTwoFactor(userId),
        onSuccess: async () => {
            toast.add({ title: t('Two-factor disabled'), type: 'success' })
            await queryClient.invalidateQueries({ queryKey: userQueries.all() })
        },
        onError: () =>
            toast.add({
                title: t('Failed to disable two-factor'),
                type: 'error',
            }),
    })

    const handleDisable = async () => {
        const confirmed = await confirm({
            title: t('Disable two-factor?'),
            description: user?.name
                ? t(
                      '{{name}} will sign in with a password alone until they set it up again. Recovery codes are cleared with it unless a passkey remains.',
                      { name: user.name }
                  )
                : t(
                      'This account will sign in with a password alone until they set it up again. Recovery codes are cleared with it unless a passkey remains.'
                  ),
            confirmText: t('Disable'),
            confirmButton: { variant: 'destructive' },
        })

        if (confirmed) disable()
    }

    return (
        <CredentialCard
            title={t('Two-factor')}
            description={t('The authenticator app on this account.')}
            icon={IconShieldLock}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            emptyTitle={t('Two-factor not set up')}
            emptyDescription={
                // A passkey is a second factor too, so "signs in with a password alone" would be
                // untrue of an account that has one.
                user && user.passkeysCount > 0
                    ? t('A passkey is the only second factor on this account.')
                    : t('This account signs in with a password alone.')
            }
            rows={
                user
                    ? user.twoFactorEnabled
                        ? [
                              <CredentialRow
                                  key={'authenticator'}
                                  icon={IconShieldLock}
                                  name={t('Authenticator app')}
                                  revokeLabel={t('Disable two-factor')}
                                  onRevoke={handleDisable}
                                  meta={
                                      <span
                                          className={
                                              'text-muted-foreground text-xs'
                                          }
                                      >
                                          {t(
                                              'A one-time code is required at sign-in.'
                                          )}
                                      </span>
                                  }
                              />,
                          ]
                        : []
                    : undefined
            }
        />
    )
}

export default TwoFactorCard
