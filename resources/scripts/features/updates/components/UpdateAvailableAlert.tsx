import { useUpdateStatus } from '@/features/updates/api.ts'
import { IconCircleArrowUp } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'

/**
 * The admin dashboard's update indicator. Renders nothing at all unless a newer
 * release exists — a panel that is current should say so only where someone
 * went looking (Settings → Updates), not on every load of the dashboard.
 */
const UpdateAvailableAlert = () => {
    const { data: status } = useUpdateStatus()

    if (!status?.updateAvailable) {
        return null
    }

    return (
        <Alert className={'border-amber-500/40 dark:border-amber-400/40'}>
            <IconCircleArrowUp className={'size-4'} />
            <AlertTitle>
                {t('Convoy {{latestVersion}} is available', {
                    latestVersion: status.latestVersion,
                })}
            </AlertTitle>
            <AlertDescription className={'text-muted-foreground'}>
                {t('This panel is running {{currentVersion}}.', {
                    currentVersion: status.currentVersion,
                })}
                <Link
                    to={'/admin/settings/updates'}
                    className={'underline underline-offset-4'}
                >
                    {t('See what changed')}
                </Link>
                .
            </AlertDescription>
        </Alert>
    )
}

export default UpdateAvailableAlert
