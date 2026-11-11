import { cn } from '@/utils'
import { ComponentProps } from 'react'

import { t } from '@/lib/i18n.ts'

const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
    <nav
        role='navigation'
        aria-label={t('Pagination')}
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
    />
)
Pagination.displayName = 'Pagination'

export default Pagination
