import { cn } from '@/utils'
import { Link, useLocation } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import Logo from '@/components/ui/Branding/Logo.tsx'

interface Props {
    collapsed?: boolean
}

const BrandLink = ({ collapsed }: Props) => {
    const pathname = useLocation({ select: l => l.pathname })
    const isAdmin = pathname.startsWith('/admin')

    return (
        <Link
            to={isAdmin ? '/admin' : '/'}
            className='flex h-9 items-center overflow-hidden rounded-md'
        >
            <span className='grid h-9 w-10 shrink-0 place-items-center'>
                <span className='bg-primary text-primary-foreground grid h-7 w-7 place-items-center rounded-md'>
                    <Logo className='h-4 w-4' />
                </span>
            </span>
            <span
                className={cn(
                    'items-center gap-2 pr-2',
                    collapsed ? 'hidden' : 'flex'
                )}
            >
                <span className='text-sidebar-foreground truncate text-sm font-semibold'>
                    {t('Convoy')}
                </span>
                {isAdmin ? (
                    <span className='bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase'>
                        {t('Admin')}
                    </span>
                ) : null}
            </span>
        </Link>
    )
}

export default BrandLink
