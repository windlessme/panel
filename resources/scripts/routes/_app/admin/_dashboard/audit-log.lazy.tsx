import { adminAuditQueries } from '@/features/audit/api.ts'
import AuditFeed from '@/features/audit/components/AuditFeed.tsx'
import usePagination from '@/hooks/use-pagination.ts'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { parseAsString, useQueryState } from 'nuqs'

import { t } from '@/lib/i18n.ts'

import { PageToolbar } from '@/components/ui/PageToolbar'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import { Heading } from '@/components/ui/Typography'

/**
 * Prefix filters over the dotted event key. The backend matches `event LIKE '<area>%'`, so one
 * entry here covers every event in that area without listing them.
 */
const AREAS = [
    { value: 'all', label: t('All activity') },
    { value: 'auth', label: t('Authentication') },
    { value: 'account', label: t('Accounts') },
    { value: 'server', label: t('Server actions') },
    { value: 'admin.server', label: t('Admin: servers') },
    { value: 'admin.node', label: t('Admin: nodes') },
    { value: 'admin.user', label: t('Admin: users') },
    { value: 'admin.token', label: t('Admin: tokens') },
    { value: 'admin.address', label: t('Admin: addressing') },
    { value: 'admin.image', label: t('Admin: definitions') },
    { value: 'admin.settings', label: t('Admin: settings') },
] as const

function AdminAuditLog() {
    const { page, setPage } = usePagination()
    const [area, setArea] = useQueryState(
        'area',
        parseAsString.withDefault('all')
    )

    const { data, isLoading, isError, refetch } = useQuery(
        adminAuditQueries.list({
            page,
            // `filters`, not `filter` — withQueryBuilderParams reads the plural key, and a spread
            // of an object literal skips TypeScript's excess-property check, so the wrong one just
            // vanishes and the list comes back unfiltered.
            ...(area === 'all' ? {} : { filters: { area } }),
        })
    )

    return (
        <>
            <Heading>{t('Audit Log')}</Heading>
            <PageToolbar>
                <Select
                    value={area}
                    onValueChange={value => {
                        setArea(value)
                        // Otherwise a narrower filter can land the reader on a page that no
                        // longer exists, showing an empty list over a non-empty result.
                        setPage(1)
                    }}
                >
                    <SelectTrigger
                        className={'w-56'}
                        aria-label={t('Filter activity')}
                    >
                        {/* Base UI renders the raw value unless given a formatter, which would
                            show "admin.node" where the reader expects "Admin: nodes". */}
                        <SelectValue>
                            {(value: string) =>
                                AREAS.find(option => option.value === value)
                                    ?.label ?? 'All activity'
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {AREAS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </PageToolbar>
            <AuditFeed
                data={data}
                isLoading={isLoading}
                isError={isError}
                onRetry={refetch}
                page={page}
                onPageChange={setPage}
                showSubject
                emptyTitle={t('Nothing recorded yet')}
            />
        </>
    )
}

export const Route = createLazyFileRoute('/_app/admin/_dashboard/audit-log')({
    component: AdminAuditLog,
})
