import { cn } from '@/utils'
import { ComponentProps } from 'react'

import { t } from '@/lib/i18n.ts'

import Logo from '@/components/ui/Branding/Logo.tsx'

interface Props extends ComponentProps<'div'> {}

const LogoWithName = ({ className, ...props }: Props) => {
    return (
        <div className={cn('flex items-center', className)} {...props}>
            <Logo className={'text-foreground mr-2 h-6 w-6'} />
            <p className={'text-xl font-semibold'}>{t('Convoy')}</p>
        </div>
    )
}

export default LogoWithName
