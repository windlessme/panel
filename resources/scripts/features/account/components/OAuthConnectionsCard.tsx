import {
    type OAuthConnection,
    oauthConnectionQueries,
    unlinkOAuthConnection,
    useOAuthConnections,
} from '@/features/account/oauth/api.ts'
import { oauthProviders, oauthRedirectUrl } from '@/features/auth/oauth.ts'
import useQueryMutator from '@/hooks/use-query-mutator.ts'
import { cn } from '@/utils'
import {
    type Icon,
    IconBrandGithub,
    IconBrandGitlab,
    IconBrandGoogle,
    IconPlugConnected,
} from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import { t } from '@/lib/i18n.ts'

import useConfirmationStore from '@/components/ui/AlertDialog/use-confirmation-store.ts'
import { Button } from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card'
import { CollectionErrorState } from '@/components/ui/EmptyStates'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/Item'
import Skeleton from '@/components/ui/Skeleton.tsx'
import { toast } from '@/components/ui/Toast'

const ICONS: Record<string, Icon> = {
    google: IconBrandGoogle,
    github: IconBrandGithub,
    gitlab: IconBrandGitlab,
}

const OAuthConnectionsCard = () => {
    const providers = oauthProviders()
    const confirm = useConfirmationStore(state => state.confirm)
    const mutate = useQueryMutator<OAuthConnection[]>(
        oauthConnectionQueries.all()
    )

    const {
        data: connections,
        isLoading,
        isError,
        refetch,
    } = useOAuthConnections()

    const { mutate: unlink } = useMutation({
        mutationFn: (connection: OAuthConnection) =>
            unlinkOAuthConnection(connection.id),
        onSuccess: (_, connection) => {
            mutate(list => list?.filter(c => c.id !== connection.id))
            toast.add({
                title: t('Disconnected {{label}}', { label: connection.label }),
                type: 'success',
            })
        },
        onError: () =>
            toast.add({
                title: t('Failed to disconnect provider'),
                type: 'error',
            }),
    })

    // No providers configured on this install — don't render an empty card.
    if (providers.length === 0) {
        return null
    }

    const connectionFor = (providerId: string): OAuthConnection | undefined =>
        connections?.find(c => c.provider === providerId)

    const handleDisconnect = async (connection: OAuthConnection) => {
        const confirmed = await confirm({
            title: t('Disconnect {{label}}', { label: connection.label }),
            description: t(
                'You will no longer be able to sign in with {{label}}. Make sure you can still access your account another way.',
                { label: connection.label }
            ),
        })
        if (!confirmed) return

        unlink(connection)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('Connected Accounts')}</CardTitle>
                <CardDescription>
                    {t(
                        'Sign in faster by connecting an external identity provider.'
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent
                className={cn(
                    (isLoading || isError) &&
                        'grid min-h-[8rem] flex-1 place-items-center'
                )}
            >
                {isError && !connections ? (
                    <CollectionErrorState onRetry={refetch} />
                ) : isLoading || !connections ? (
                    <Skeleton className={'h-24 w-full'} />
                ) : (
                    <ItemGroup className={'gap-3'}>
                        {providers.map(provider => {
                            const ProviderIcon =
                                ICONS[provider.id] ?? IconPlugConnected
                            const connection = connectionFor(provider.id)

                            return (
                                <Item
                                    key={provider.id}
                                    variant={'muted'}
                                    size={'sm'}
                                >
                                    <ItemMedia variant={'icon'}>
                                        <ProviderIcon
                                            className={'text-muted-foreground'}
                                        />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>{provider.label}</ItemTitle>
                                        {connection?.email && (
                                            <ItemDescription>
                                                {connection.email}
                                            </ItemDescription>
                                        )}
                                    </ItemContent>
                                    <ItemActions>
                                        {connection ? (
                                            <Button
                                                variant={'outline'}
                                                onClick={() =>
                                                    handleDisconnect(connection)
                                                }
                                            >
                                                {t('Disconnect')}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={'outline'}
                                                onClick={() => {
                                                    window.location.href =
                                                        oauthRedirectUrl(
                                                            provider.id
                                                        )
                                                }}
                                            >
                                                {t('Connect')}
                                            </Button>
                                        )}
                                    </ItemActions>
                                </Item>
                            )
                        })}
                    </ItemGroup>
                )}
            </CardContent>
        </Card>
    )
}

export default OAuthConnectionsCard
