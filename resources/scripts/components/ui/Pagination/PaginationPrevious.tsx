import { cn } from '@/utils'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { ComponentProps } from 'react'

import { t } from '@/lib/i18n.ts'

import { PaginationLink } from '@/components/ui/Pagination/index.ts'

const PaginationPrevious = ({
    className,
    ...props
}: ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label={t('Go to previous page')}
        size='default'
        className={cn('gap-1 pl-2.5', className)}
        {...props}
    >
        <ChevronLeftIcon className='h-4 w-4' />
        <span>{t('Previous')}</span>
    </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

export default PaginationPrevious
