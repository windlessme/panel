import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import useNodesSWR from '@/api/admin/nodes/useNodesSWR'

import SelectForm from '@/components/elements/forms/SelectForm'


interface Props {
    disabled?: boolean
}

const NodesSelectForm = ({ disabled }: Props) => {
    const { t } = useTranslation('admin.servers.index')
    const { t: tStrings } = useTranslation('strings')
    const { watch } = useFormContext()
    const nodeId: string = watch('nodeId')
    const [query, setQuery] = useState(nodeId)

    const [debouncedQuery] = useDebouncedValue(query, 200)
    const { data, isValidating, isLoading } = useNodesSWR({
        query: debouncedQuery,
    })
    const nodes =
        data?.items.map(node => ({
            value: node.id.toString(),
            label: node.name,
            description: node.fqdn,
        })) ?? []

    return (
        <SelectForm
            label={tStrings('node')}
            data={nodes}
            searchable
            searchValue={query}
            onSearchChange={query => setQuery(query)}
            loading={isValidating || isLoading}
            nothingFound={t('no_nodes_found')}
            name={'nodeId'}
            disabled={disabled}
        />
    )
}

export default NodesSelectForm