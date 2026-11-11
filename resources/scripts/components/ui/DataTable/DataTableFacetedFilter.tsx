import { Option } from '@/types/data-table.ts'
import { cn } from '@/utils'
import { IconCheck, IconCirclePlus } from '@tabler/icons-react'
import { Column } from '@tanstack/react-table'

import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/Command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover'
import { Separator } from '@/components/ui/Separator'

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: Option[]
}

const DataTableFacetedFilter = <TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) => {
    const facets = column?.getFacetedUniqueValues()
    const selectedValues = new Set(column?.getFilterValue() as string[])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline' className='border-dashed'>
                    <IconCirclePlus />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator
                                orientation='vertical'
                                className='mx-2 h-4'
                            />
                            <Badge
                                variant='secondary'
                                className='rounded-sm px-1 font-normal lg:hidden'
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className='hidden space-x-1 lg:flex'>
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant='secondary'
                                        className='rounded-sm px-1 font-normal'
                                    >
                                        {t('{{count}} selected', {
                                            count: selectedValues.size,
                                        })}
                                    </Badge>
                                ) : (
                                    options
                                        .filter(option =>
                                            selectedValues.has(option.value)
                                        )
                                        .map(option => (
                                            <Badge
                                                variant='secondary'
                                                key={option.value}
                                                className='rounded-sm px-1 font-normal'
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0' align='start'>
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>{t('No results found.')}</CommandEmpty>
                        <CommandGroup>
                            {options.map(option => {
                                const isSelected = selectedValues.has(
                                    option.value
                                )
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(
                                                    option.value
                                                )
                                            } else {
                                                selectedValues.add(option.value)
                                            }
                                            const filterValues =
                                                Array.from(selectedValues)
                                            column?.setFilterValue(
                                                filterValues.length
                                                    ? filterValues
                                                    : undefined
                                            )
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <IconCheck />
                                        </div>
                                        {option.icon && (
                                            <option.icon className='text-muted-foreground mr-2 h-4 w-4' />
                                        )}
                                        <span>{option.label}</span>
                                        {facets?.get(option.value) && (
                                            <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() =>
                                            column?.setFilterValue(undefined)
                                        }
                                        className='justify-center text-center'
                                    >
                                        {t('Clear filters')}
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default DataTableFacetedFilter
