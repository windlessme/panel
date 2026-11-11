import { ComponentPropsWithoutRef, ReactNode, forwardRef } from 'react'

import { t } from '@/lib/i18n.ts'

const Breadcrumb = forwardRef<
    HTMLElement,
    ComponentPropsWithoutRef<'nav'> & {
        separator?: ReactNode
    }
>(({ ...props }, ref) => (
    <nav ref={ref} aria-label={t('Breadcrumb')} {...props} />
))
Breadcrumb.displayName = 'Breadcrumb'

export default Breadcrumb
