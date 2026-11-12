import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import useLocationsSWR from '@/api/admin/locations/useLocationsSWR'

import SelectForm from '@/components/elements/forms/SelectForm'


const LocationsSelectForm = () => {
    const { t } = useTranslation('admin.nodes.index')
    const { watch } = useFormContext()
    const locationId: string = watch('locationId')
    const [query, setQuery] = useState(locationId)
    const [debouncedQuery] = useDebouncedValue(query, 200)
    const { data, mutate, isValidating, isLoading } = useLocationsSWR({
        query: debouncedQuery,
    })
    const locations =
        data?.items.map(location => ({
            value: location.id.toString(),
            label: location.shortCode,
        })) ?? []

    return (
        <SelectForm
            label={t('location_group')}
            data={locations}
            searchable
            searchValue={query}
            onSearchChange={val => setQuery(val)}
            loading={isValidating || isLoading}
            nothingFound={t('no_locations_found')}
            name='locationId'
        />
    )
}

export default LocationsSelectForm