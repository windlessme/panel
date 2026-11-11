import { useNetworkInterfaces } from '@/features/nodes/network-interfaces/api.ts'
import { IconNetwork } from '@tabler/icons-react'
import { useFormContext } from 'react-hook-form'

import { t } from '@/lib/i18n.ts'

import SimpleEmptyState from '@/components/ui/EmptyStates/SimpleEmptyState'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'

interface NetworkInterfacePickerProps {
    nodeId: number | null
}

const NetworkInterfacePicker = ({ nodeId }: NetworkInterfacePickerProps) => {
    const { control } = useFormContext()
    const { data, isLoading } = useNetworkInterfaces(nodeId)
    const items = (data ?? []).map(item => {
        const vlanLabel = item.vlanTag
            ? t('VLAN {{tag}}', { tag: item.vlanTag })
            : item.isVlanAware
              ? t('Untagged')
              : t('No VLAN')

        return {
            value: item.id.toString(),
            label: (
                <span className='flex w-full items-center justify-between gap-2'>
                    <span>{item.name}</span>
                    <span className='text-muted-foreground text-xs'>
                        {vlanLabel}
                    </span>
                </span>
            ),
        }
    })

    return (
        <FormField
            control={control}
            name='networkInterfaceId'
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('Network Interface')}</FormLabel>
                    <Select
                        items={items}
                        onValueChange={field.onChange}
                        // Controlled: the field is also written from outside
                        // the picker (applying a preset), which an
                        // uncontrolled Select would ignore.
                        value={field.value ?? null}
                        disabled={!nodeId || isLoading}
                    >
                        <FormControl>
                            <SelectTrigger className='w-full'>
                                <SelectValue
                                    placeholder={t(
                                        'Select a network interface'
                                    )}
                                />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {data?.length === 0 ? (
                                <div className='p-2'>
                                    <SimpleEmptyState
                                        icon={IconNetwork}
                                        title={t('No Network Interfaces')}
                                        description={t(
                                            'There are no network interfaces available for this node.'
                                        )}
                                    />
                                </div>
                            ) : (
                                items.map(item => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default NetworkInterfacePicker
