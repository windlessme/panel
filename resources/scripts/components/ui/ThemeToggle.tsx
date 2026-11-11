import { useTheme } from '@/providers/theme-provider'
import { IconMoon, IconSun } from '@tabler/icons-react'

import { t } from '@/lib/i18n.ts'

import { Button, ButtonProps } from '@/components/ui/Button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

interface Props {
    variant?: ButtonProps['variant']
}

const ThemeToggle = ({ variant = 'outline' }: Props) => {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size='icon'>
                    <IconSun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
                    <IconMoon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
                    <span className='sr-only'>{t('Toggle theme')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    {t('Light')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    {t('Dark')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    {t('System', { context: 'theme' })}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeToggle
