import Session from '@/features/account/components/Session.tsx'
import {
    type Session as SessionType,
    revokeSession,
    sessionQueries,
    useSessions,
} from '@/features/account/sessions/api.ts'
import useQueryMutator from '@/hooks/use-query-mutator.ts'
import { cn } from '@/utils'
import { IconDevices } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import { t } from '@/lib/i18n.ts'

import useConfirmationStore from '@/components/ui/AlertDialog/use-confirmation-store.ts'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card'
import {
    CollectionErrorState,
    SimpleEmptyState,
} from '@/components/ui/EmptyStates'
import { OverflowItemGroup } from '@/components/ui/Item'
import Skeleton from '@/components/ui/Skeleton.tsx'
import { toast } from '@/components/ui/Toast'

const SessionListCard = () => {
    const confirm = useConfirmationStore(state => state.confirm)
    const mutate = useQueryMutator<SessionType[]>(sessionQueries.all())

    const { data: sessions, isLoading, isError, refetch } = useSessions()

    const { mutate: revoke } = useMutation({
        mutationFn: (session: SessionType) => revokeSession(session.id),
        onSuccess: (_, session) => {
            mutate(list => list?.filter(s => s.id !== session.id))
            toast.add({ title: t('Session revoked'), type: 'success' })
        },
        onError: () =>
            toast.add({ title: t('Failed to revoke session'), type: 'error' }),
    })

    const handleRevoke = async (session: SessionType) => {
        const confirmed = await confirm({
            title: t('Revoke session'),
            description: t(
                'The session on {{device}} will be signed out immediately.',
                { device: session.device }
            ),
        })
        if (!confirmed) return

        revoke(session)
    }

    return (
        <Card className={'flex flex-col'}>
            <CardHeader>
                <CardTitle>{t('Active Sessions')}</CardTitle>
                <CardDescription>
                    {t(
                        'Devices signed in to your account. Revoke any you don’t recognize.'
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent
                className={cn(
                    (isLoading || isError || sessions?.length === 0) &&
                        'grid min-h-[12rem] flex-1 place-items-center'
                )}
            >
                {isError && !sessions ? (
                    <CollectionErrorState onRetry={refetch} />
                ) : isLoading || !sessions ? (
                    <Skeleton className={'h-40 w-full'} />
                ) : sessions.length > 0 ? (
                    <OverflowItemGroup
                        title={t('Active Sessions')}
                        rows={sessions.map(session => (
                            <Session
                                key={session.id}
                                session={session}
                                onRevoke={handleRevoke}
                            />
                        ))}
                    />
                ) : (
                    <SimpleEmptyState
                        icon={IconDevices}
                        title={t('No active sessions')}
                        description={t('There are no other sessions to show.')}
                    />
                )}
            </CardContent>
        </Card>
    )
}

export default SessionListCard
