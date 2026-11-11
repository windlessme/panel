import { IconLayoutSidebar } from '@tabler/icons-react'
import { useState } from 'react'

import { t } from '@/lib/i18n.ts'

import Logo from '@/components/ui/Branding/Logo.tsx'
import { Button } from '@/components/ui/Button'
import { SidebarNav } from '@/components/ui/Navigation/Navigation.types.ts'
import SidebarContent from '@/components/ui/Navigation/Sidebar/SidebarContent.tsx'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet'

interface Props {
    nav: SidebarNav
}

const SidebarToggle = ({ nav }: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button size='icon' variant='outline' className='sm:hidden'>
                        <IconLayoutSidebar className='h-5 w-5' />
                        <span className='sr-only'>Toggle Menu</span>
                    </Button>
                }
            />
            <SheetContent side='left' className='bg-sidebar w-72 sm:max-w-xs'>
                <div className='mb-3 flex items-center gap-2 px-1'>
                    <span className='bg-primary text-primary-foreground grid h-7 w-7 shrink-0 place-items-center rounded-md'>
                        <Logo className='h-4 w-4' />
                    </span>
                    <span className='text-sm font-semibold'>{t('Convoy')}</span>
                </div>
                <nav className='flex flex-col'>
                    <SidebarContent
                        nav={nav}
                        onNavigate={() => setOpen(false)}
                    />
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default SidebarToggle
