import { sshKeyAlgorithm } from '@/features/account/ssh-keys/api.ts'
import type { SSHKey } from '@/features/account/types.ts'
import CredentialCard from '@/features/users/components/Security/CredentialCard.tsx'
import CredentialRow from '@/features/users/components/Security/CredentialRow.tsx'
import {
    revokeUserSSHKey,
    useUserSSHKeys,
    userCredentialQueries,
} from '@/features/users/credentials/api.ts'
import useCredentialRevocation from '@/features/users/hooks/use-credential-revocation.ts'
import { IconKeyFilled } from '@tabler/icons-react'
import { format } from 'date-fns'

import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge'

interface Props {
    userId: number
}

const SSHKeysCard = ({ userId }: Props) => {
    const { data: keys, isLoading, isError, refetch } = useUserSSHKeys(userId)

    const revoke = useCredentialRevocation<SSHKey>({
        queryKey: userCredentialQueries.sshKeys(userId).queryKey,
        remove: key => revokeUserSSHKey(userId, key.id),
        question: t('Revoke SSH key?'),
        successTitle: t('SSH key revoked'),
        errorTitle: t('Failed to revoke SSH key'),
        nameOf: key => t('The key “{{name}}”', { name: key.name }),
        consequence: t(
            'Any server it was injected into keeps it until the server is rebuilt.'
        ),
    })

    return (
        <CredentialCard
            title={t('SSH keychain')}
            description={t(
                'Public keys this account injects into its servers.'
            )}
            icon={IconKeyFilled}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            emptyTitle={t('No SSH keys')}
            emptyDescription={t('This account has not added a public key.')}
            rows={keys?.map(key => (
                <CredentialRow
                    key={key.id}
                    icon={IconKeyFilled}
                    name={key.name}
                    revokeLabel={t('Revoke SSH key {{name}}', {
                        name: key.name,
                    })}
                    onRevoke={() => revoke(key)}
                    meta={
                        <>
                            <Badge
                                variant={'secondary'}
                                className={
                                    'shrink-0 font-mono whitespace-nowrap'
                                }
                            >
                                {sshKeyAlgorithm(key.publicKey)}
                            </Badge>
                            <span
                                className={
                                    'text-muted-foreground text-xs whitespace-nowrap'
                                }
                            >
                                {t('Added {{date}}', {
                                    date: format(
                                        key.createdAt,
                                        'MMMM do, yyyy'
                                    ),
                                })}
                            </span>
                        </>
                    }
                />
            ))}
        />
    )
}

export default SSHKeysCard
