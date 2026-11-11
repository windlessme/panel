import ConsoleButton from '@/features/servers/components/client/Overview/ConsoleButton.tsx'
import PowerActionsDropdown from '@/features/servers/components/client/Overview/PowerActionsDropdown.tsx'
import PowerActionsExpanded from '@/features/servers/components/client/Overview/PowerActionsExpanded.tsx'
import { usePowerActionToast } from '@/features/servers/detail/use-power-action-toast.ts'
import { cn } from '@/utils'

import { t } from '@/lib/i18n.ts'

export const actions = {
    start: {
        buttonText: t('Start server'),
        toastText: t('Server queued to start'),
        title: t('Start server?'),
        description: t('This action will start your server'),
    },
    restart: {
        buttonText: t('Restart server'),
        toastText: t('Server queued to restart'),
        title: t('Restart server?'),
        description: t(
            'Please save your work and close out of any running processes. Any unsaved changes will be lost, and active sessions may be interrupted. Proceed only when it is safe to restart'
        ),
    },
    kill: {
        buttonText: t('Kill server'),
        toastText: t('Server queued to be killed'),
        title: t('Kill server?'),
        description: t(
            'This action will immediately stop all processes, resulting in loss of any unsaved data. Ensure that all critical tasks are saved and completed before proceeding'
        ),
    },
    shutdown: {
        buttonText: t('Shutdown server'),
        toastText: t('Server queued to be shutdown'),
        title: t('Shutdown server?'),
        description: t(
            'This will power off all services and processes, potentially causing data loss if there are unsaved changes. Please ensure all work is saved and close any active connections before proceeding'
        ),
    },
}

interface Props {
    className?: string
}

const Toolbar = ({ className }: Props) => {
    // Surfaces the in-progress / success / failure toast for power actions on
    // this server; dismissed automatically when the overview unmounts.
    usePowerActionToast()

    return (
        <>
            <div
                className={cn(
                    'grid grid-cols-2 justify-end gap-2 @sm:flex',
                    className
                )}
            >
                <ConsoleButton />
                <PowerActionsDropdown />
                <PowerActionsExpanded />
            </div>
        </>
    )
}

export default Toolbar
