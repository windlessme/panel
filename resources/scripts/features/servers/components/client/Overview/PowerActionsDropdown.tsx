import { actions } from '@/features/servers/components/client/Overview/Toolbar.tsx'
import {
    type PowerAction,
    sendPowerCommand,
    useServer,
    useServerState,
} from '@/features/servers/detail/api.ts'

import { t } from '@/lib/i18n.ts'

import useConfirmationStore from '@/components/ui/AlertDialog/use-confirmation-store.ts'
import { Button } from '@/components/ui/Button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { toast } from '@/components/ui/Toast'

const PowerActionsDropdown = () => {
    const confirm = useConfirmationStore(state => state.confirm)
    const { data: server } = useServer()
    const { data } = useServerState()

    // A power action already in flight disables all controls until it clears.
    const pending = !!data?.pendingPowerAction

    const handlePowerAction = async (action: PowerAction) => {
        try {
            const confirmed = await confirm({
                title: actions[action].title,
                description: actions[action].description,
            })
            setTimeout(() => {
                document.body.style.pointerEvents = 'auto'
            }, 1000)
            if (!confirmed) return

            await sendPowerCommand(server!.uuid, action)
        } catch (e) {
            toast.add({ title: t('Power action failed'), type: 'error' })
            throw e
        }
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button className={'block @sm:hidden'}>
                    {t('Power Actions')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    disabled={
                        !data || pending || data?.powerState === 'running'
                    }
                    onClick={() => handlePowerAction('start')}
                >
                    {t('Start')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={
                        !data || pending || data?.powerState === 'stopped'
                    }
                    onClick={() => handlePowerAction('restart')}
                >
                    {t('Restart')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant={'destructive'}
                    disabled={
                        !data || pending || data?.powerState === 'stopped'
                    }
                    onClick={() => handlePowerAction('kill')}
                >
                    {t('Kill')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={
                        !data || pending || data?.powerState === 'stopped'
                    }
                    onClick={() => handlePowerAction('shutdown')}
                >
                    {t('Shutdown')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PowerActionsDropdown
