import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge'

type State = App.Enums.Server.PowerState

const labels: Record<State, string> = {
    running: t('Running'),
    stopped: t('Stopped'),
    starting: t('Starting'),
    stopping: t('Stopping'),
    shutting_down: t('Shutting down'),
}

const PowerStateBadge = ({ state }: { state: State | null }) => (
    <Badge variant={state === 'running' ? 'default' : 'secondary'}>
        {state ? labels[state] : t('Unknown')}
    </Badge>
)

export default PowerStateBadge
