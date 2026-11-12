import { useDebouncedValue } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import useUsersSWR from '@/api/admin/users/useUsersSWR'

import DescriptiveItemComponent from '@/components/elements/DescriptiveItemComponent'
import SelectForm from '@/components/elements/forms/SelectForm'


const UsersSelectForm = () => {
    const { t } = useTranslation('admin.servers.index')
    const { t: tStrings } = useTranslation('strings')
    const { setValue, watch } = useFormContext()
    const userId: string = watch('userId')
    const [query, setQuery] = useState(userId)
    const [debouncedQuery] = useDebouncedValue(query, 200)
    const { data, isValidating, isLoading } = useUsersSWR({
        query: debouncedQuery,
    })
    const users = useMemo(
        () =>
            data?.items.map(user => ({
                value: user.id.toString(),
                label: user.name,
                description: user.email,
            })) ?? [],
        [data]
    )

    return (
        <SelectForm
            label={tStrings('user')}
            data={users}
            searchable
            searchValue={query}
            onSearchChange={val => setQuery(val)}
            loading={isValidating || isLoading}
            nothingFound={t('no_users_found')}
            name={'userId'}
            itemComponent={DescriptiveItemComponent}
        />
    )
}

export default UsersSelectForm