import { getLocations, useLocation } from '@/features/locations/api.ts'
import { Location } from '@/features/locations/types.ts'
import { cn } from '@/utils'
import { IconCheck, IconMapPin } from '@tabler/icons-react'
import { useController } from 'react-hook-form'

import { t } from '@/lib/i18n.ts'

import { ResourceComboboxForm } from '@/components/ui/Forms'
import Skeleton from '@/components/ui/Skeleton.tsx'

const LocationPicker = () => {
    const { field } = useController<{
        locationId: string
    }>({
        name: 'locationId',
    })
    const { data: selectedLocation, isLoading: isLoadingSelection } =
        useLocation(field.value ? Number(field.value) : null)

    return (
        <ResourceComboboxForm<Location>
            queryKey={'locations'}
            accessorKey={'id'}
            name={'locationId'}
            fetcher={(query, page) =>
                getLocations({
                    page: page,
                    filters: {
                        '*': query,
                    },
                })
            }
            renderItem={(location, isSelected) => (
                <>
                    <dl className={'flex grow flex-col overflow-hidden'}>
                        <dt className={'truncate'}>{location.shortCode}</dt>
                        <dd
                            className={'text-muted-foreground truncate text-xs'}
                        >
                            {location.description}
                        </dd>
                    </dl>

                    <IconCheck
                        className={cn(
                            'shrink-0',
                            isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                </>
            )}
            renderTrigger={() => (
                <>
                    {isLoadingSelection ? (
                        <Skeleton className={'h-3 w-24'} />
                    ) : selectedLocation ? (
                        selectedLocation.shortCode
                    ) : (
                        'Select a location'
                    )}

                    <IconMapPin className={'ml-auto size-4 opacity-50'} />
                </>
            )}
            label={t('Location')}
            searchPlaceholder={t('Search locations...')}
        />
    )
}

export default LocationPicker
