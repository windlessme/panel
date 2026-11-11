import { format, formatDistanceToNowStrict } from 'date-fns'

import { t } from '@/lib/i18n.ts'

import type { UpdateStatus } from './api'

/**
 * The mark that sits beside the version number. There is deliberately no mark
 * for the unknown state: a panel built from source has nothing to be right or
 * wrong about, and a third symbol for "no opinion" is just noise.
 */
export type UpdateMark = 'behind' | 'current' | null

export interface UpdateSummary {
    mark: UpdateMark
    /** Names the mark for anyone who cannot see its colour or shape. */
    label: string
    /** The line under the version number. Always says what to do, or why not. */
    caption: string
}

const relative = (value: string) =>
    formatDistanceToNowStrict(new Date(value), { addSuffix: true })

/** "3 hours ago", or a plain admission when no check has ever completed. */
export const lastChecked = (status: UpdateStatus) =>
    status.checkedAt ? relative(status.checkedAt) : t('Never')

/** "4.6.1 · 9 August 2026" — the release, dated, on one line. */
export const releaseLine = (status: UpdateStatus) =>
    [
        status.latestVersion,
        status.releasedAt && format(new Date(status.releasedAt), 'd MMMM yyyy'),
    ]
        .filter(Boolean)
        .join(' · ')

const updateSummary = (status: UpdateStatus): UpdateSummary => {
    switch (status.status) {
        case 'update_available':
            return {
                mark: 'behind',
                label: t('Update available'),
                caption: t('{{latestVersion}} is available', {
                    latestVersion: status.latestVersion,
                }),
            }
        case 'up_to_date':
            return {
                mark: 'current',
                label: t('Up to date'),
                caption: t('Running the newest release'),
            }
        default:
            return {
                mark: null,
                label: t('Not comparable'),
                // The panel reports `canary` when it is running from source
                // rather than a release archive, so there is no release to
                // compare it against.
                caption: status.latestVersion
                    ? t('Built from source')
                    : t('Not checked yet'),
            }
    }
}

export default updateSummary
