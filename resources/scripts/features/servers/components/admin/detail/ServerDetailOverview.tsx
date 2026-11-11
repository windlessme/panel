import { useServer, useUnflagServer } from '@/features/servers/admin/api.ts'
import ServerPowerActions from '@/features/servers/components/admin/ServerPowerActions.tsx'
import { serverStateQueries } from '@/features/servers/state/api.ts'
import { ServerLifecycle } from '@/types/server.ts'
import { IconBolt } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import byteSize from 'byte-size'

import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import CopyValue from '@/components/ui/CopyValue.tsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { PageToolbar } from '@/components/ui/PageToolbar'
import Skeleton from '@/components/ui/Skeleton.tsx'
import { toast } from '@/components/ui/Toast'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/Tooltip'
import { Heading } from '@/components/ui/Typography'

interface Props {
    serverId: number
}

const LIFECYCLE_LABELS: Record<ServerLifecycle, string> = {
    [ServerLifecycle.Ready]: t('Ready'),
    [ServerLifecycle.DeferredOsSelection]: t('Awaiting OS selection'),
    [ServerLifecycle.Installing]: t('Installing'),
    [ServerLifecycle.InstallFailed]: t('Install failed'),
    [ServerLifecycle.RestoringBackup]: t('Restoring backup'),
    [ServerLifecycle.Deleting]: t('Deleting'),
    [ServerLifecycle.DeletionFailed]: t('Deletion failed'),
}

const formatBytes = (bytes: number) => {
    const size = byteSize(bytes, { units: 'iec', precision: 2 })

    return `${size.value} ${size.unit}`
}

const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '—'

    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return [days && `${days}d`, hours && `${hours}h`, `${minutes}m`]
        .filter(Boolean)
        .join(' ')
}

const ServerDetailOverview = ({ serverId }: Props) => {
    const { data: server } = useServer(serverId)
    const unflagServer = useUnflagServer()
    const { data: state } = useQuery({
        ...serverStateQueries.detail(server?.uuid ?? ''),
        enabled: !!server?.uuid,
    })

    const specs = server && [
        { title: t('vCPU Cores'), value: server.cpu },
        { title: t('Memory'), value: formatBytes(server.memory) },
        { title: t('Disk'), value: formatBytes(server.disk) },
        {
            title: t('Bandwidth'),
            value:
                server.bandwidth.limit > 0
                    ? formatBytes(server.bandwidth.limit)
                    : t('Unlimited'),
        },
    ]

    const details = server && [
        {
            title: t('Node'),
            value: server.node ? (
                <Link
                    className='text-primary hover:underline'
                    to={`/admin/nodes/${server.nodeId}` as string}
                >
                    {server.node.displayName}
                </Link>
            ) : (
                server.nodeId
            ),
        },
        {
            title: t('Owner (user ID)'),
            value: (
                <CopyValue
                    label={t('user ID')}
                    value={String(server.userId)}
                    className={'tabular-nums'}
                />
            ),
        },
        {
            title: 'VMID',
            value: (
                <CopyValue
                    label={'VMID'}
                    value={String(server.vmid)}
                    className={'tabular-nums'}
                />
            ),
        },
        {
            title: 'UUID',
            value: (
                <CopyValue
                    label={'UUID'}
                    value={server.uuid}
                    className={'text-xs'}
                />
            ),
        },
        { title: t('Created'), value: server.createdAt.toLocaleString() },
        { title: t('Description'), value: server.description || '—' },
    ]

    return (
        <>
            <div className='space-y-1'>
                <div className='flex flex-wrap items-center gap-3'>
                    {server ? (
                        <Heading>{server.name}</Heading>
                    ) : (
                        <Skeleton className='h-8 w-48' />
                    )}
                    {/* Two badges, never one: suspension sits alongside the
                        lifecycle rather than replacing it, so a suspended
                        server still shows the stage it is actually in. */}
                    {server && (
                        <Badge variant='outline'>
                            {LIFECYCLE_LABELS[server.lifecycle] ??
                                server.lifecycle}
                        </Badge>
                    )}
                    {server?.suspendedAt && (
                        <Badge variant='destructive'>{t('Suspended')}</Badge>
                    )}
                    {server?.flaggedAt && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant='destructive'>
                                        {t('Flagged')}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent className='max-w-72'>
                                    {server.flagReason ??
                                        t('Flagged for review.')}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                {server && (
                    <p className='text-muted-foreground text-sm'>
                        {server.hostname}
                    </p>
                )}
            </div>

            {server && (
                <PageToolbar
                    actions={
                        <>
                            {/* Clearing the flag is an action, so it sits with
                                the other actions; the badge above still says
                                why the server is flagged. */}
                            {server.flaggedAt && (
                                <Button
                                    variant='outline'
                                    disabled={unflagServer.isPending}
                                    onClick={() =>
                                        unflagServer.mutate(server.uuid, {
                                            onSuccess: () =>
                                                toast.add({
                                                    title: t('Flag cleared'),
                                                    type: 'success',
                                                }),
                                            onError: () =>
                                                toast.add({
                                                    title: t(
                                                        'Failed to clear the flag'
                                                    ),
                                                    type: 'error',
                                                }),
                                        })
                                    }
                                >
                                    {t('Clear flag')}
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button>
                                        <IconBolt className='size-4' />
                                        {t('Power')}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <ServerPowerActions server={server} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    }
                />
            )}

            <div className='grid grid-cols-1 gap-4 @md:grid-cols-2 @xl:grid-cols-3'>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Live state')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {state ? (
                            <dl className='grid grid-cols-2 gap-y-3 text-sm'>
                                <dt className='text-muted-foreground'>
                                    {t('Power')}
                                </dt>
                                <dd className='text-right font-medium'>
                                    {state.powerState === 'running'
                                        ? t('Running')
                                        : t('Stopped')}
                                </dd>
                                <dt className='text-muted-foreground'>
                                    {t('Uptime')}
                                </dt>
                                <dd className='text-right'>
                                    {formatDuration(state.uptime)}
                                </dd>
                                <dt className='text-muted-foreground'>
                                    {t('CPU')}
                                </dt>
                                <dd className='text-right'>
                                    {(state.cpuUsed * 100).toFixed(1)}%
                                </dd>
                                <dt className='text-muted-foreground'>
                                    {t('Memory')}
                                </dt>
                                <dd className='text-right'>
                                    {formatBytes(state.memoryUsed)} /{' '}
                                    {formatBytes(state.memoryTotal)}
                                </dd>
                            </dl>
                        ) : (
                            <Skeleton className='h-24 w-full' />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('Specifications')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {specs ? (
                            <dl className='grid grid-cols-2 gap-y-3 text-sm'>
                                {specs.map(spec => (
                                    <div key={spec.title} className='contents'>
                                        <dt className='text-muted-foreground'>
                                            {spec.title}
                                        </dt>
                                        <dd className='text-right'>
                                            {spec.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <Skeleton className='h-24 w-full' />
                        )}
                    </CardContent>
                </Card>

                <Card className='@md:col-span-2 @xl:col-span-1'>
                    <CardHeader>
                        <CardTitle>{t('Details')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {details ? (
                            <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm'>
                                {details.map(detail => (
                                    <div
                                        key={detail.title}
                                        className='contents'
                                    >
                                        <dt className='text-muted-foreground'>
                                            {detail.title}
                                        </dt>
                                        <dd className='text-right'>
                                            {detail.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <Skeleton className='h-32 w-full' />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ServerDetailOverview
