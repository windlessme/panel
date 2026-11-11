import StorageInventory from '@/features/nodes/components/Storages/StorageInventory.tsx'
import { storageInventoryQuery } from '@/features/nodes/storages/api.ts'
import { IconDatabase } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import { Card } from '@/components/ui/Card'
import {
    CollectionErrorState,
    SimpleEmptyState,
} from '@/components/ui/EmptyStates'
import Skeleton from '@/components/ui/Skeleton.tsx'
import { Heading } from '@/components/ui/Typography'

export const Route = createLazyFileRoute('/_app/admin/_dashboard/storage/')({
    component: StorageInventoryPage,
})

function StorageInventoryPage() {
    const {
        data: storages,
        isLoading,
        isError,
        refetch,
    } = useQuery(storageInventoryQuery)

    return (
        <>
            <Heading>{t('Storage')}</Heading>

            {isError && !storages ? (
                <Card className={'py-6'}>
                    <CollectionErrorState onRetry={refetch} />
                </Card>
            ) : isLoading ? (
                <div className={'flex flex-col gap-2'}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className={'h-16'} />
                    ))}
                </div>
            ) : storages?.length === 0 ? (
                <Card className={'py-6'}>
                    <SimpleEmptyState
                        icon={IconDatabase}
                        title={t('No storage yet')}
                        description={t(
                            'Register storage on a node to deploy servers there.'
                        )}
                    />
                </Card>
            ) : (
                <StorageInventory storages={storages ?? []} />
            )}
        </>
    )
}
