import type { ApiKey } from '@/features/account/api-keys/api.ts'
import CredentialCard from '@/features/users/components/Security/CredentialCard.tsx'
import CredentialRow from '@/features/users/components/Security/CredentialRow.tsx'
import {
    revokeUserApiKey,
    useUserApiKeys,
    userCredentialQueries,
} from '@/features/users/credentials/api.ts'
import useCredentialRevocation from '@/features/users/hooks/use-credential-revocation.ts'
import { IconKey } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'

import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge'

interface Props {
    userId: number
}

/** `*` is the wildcard the backend stores for full access; spell it out for a reader. */
const scopeLabel = (abilities: string[]) =>
    abilities.length === 0 || abilities.includes('*')
        ? 'Full access'
        : abilities.join(', ')

const UserApiKeysCard = ({ userId }: Props) => {
    const { data: keys, isLoading, isError, refetch } = useUserApiKeys(userId)

    const revoke = useCredentialRevocation<ApiKey>({
        queryKey: userCredentialQueries.apiKeys(userId).queryKey,
        remove: key => revokeUserApiKey(userId, key.id),
        question: t('Revoke API key?'),
        successTitle: t('API key revoked'),
        errorTitle: t('Failed to revoke API key'),
        nameOf: key => `The key “${key.name}”`,
        consequence: t('Anything using it will start getting 401s.'),
    })

    return (
        <CredentialCard
            title={t('Issued keys')}
            description={t(
                'Tokens this account created for itself. Panel-wide application tokens live under API Tokens.'
            )}
            icon={IconKey}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            emptyTitle={t('No API keys')}
            emptyDescription={t('This account has not issued a token.')}
            rows={keys?.map(key => (
                <CredentialRow
                    key={key.id}
                    icon={IconKey}
                    name={key.name}
                    revokeLabel={`Revoke API key ${key.name}`}
                    onRevoke={() => revoke(key)}
                    meta={
                        <>
                            <Badge
                                variant={'secondary'}
                                className={'shrink-0 whitespace-nowrap'}
                            >
                                {scopeLabel(key.abilities)}
                            </Badge>
                            <span
                                className={
                                    'text-muted-foreground text-xs whitespace-nowrap'
                                }
                            >
                                {key.lastUsedAt
                                    ? `Used ${formatDistanceToNow(key.lastUsedAt, { addSuffix: true })}`
                                    : 'Never used'}
                            </span>
                        </>
                    }
                />
            ))}
        />
    )
}

export default UserApiKeysCard
