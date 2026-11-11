import { cn } from '@/utils'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ComponentProps } from 'react'

import { t } from '@/lib/i18n.ts'

const BreadcrumbEllipsis = ({
    className,
    ...props
}: ComponentProps<'span'>) => (
    <span
        role='presentation'
        aria-hidden='true'
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        <DotsHorizontalIcon className='h-4 w-4' />
        <span className='sr-only'>{t('More')}</span>
    </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis'

export default BreadcrumbEllipsis
