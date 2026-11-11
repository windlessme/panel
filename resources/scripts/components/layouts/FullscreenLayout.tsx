import { cn } from '@/utils'
import { IconX } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { ReactNode } from 'react'

import { t } from '@/lib/i18n.ts'

import { buttonVariants } from '@/components/ui/Button'

interface Props {
    backLink: string
    title: string
    headerActions?: ReactNode
    center?: boolean
    children?: ReactNode
}

const FullscreenLayout = ({
    backLink,
    title,
    headerActions,
    center,
    children,
}: Props) => {
    return (
        <div className={'flex h-full flex-col'}>
            <header
                className={
                    'border-accent flex justify-between border-b py-4 pr-5 pl-3'
                }
            >
                <div className={'flex items-center'}>
                    <Link
                        to={backLink}
                        className={cn(
                            buttonVariants({
                                variant: 'ghost',
                                size: 'icon',
                            }),
                            'absolute'
                        )}
                        aria-label={t('Go back')}
                    >
                        <IconX
                            aria-hidden='true'
                            className={'text-accent-foreground/60 size-4'}
                        />
                    </Link>
                    <div
                        className={'bg-muted-foreground/30 mr-5 ml-11 h-4 w-px'}
                    />
                    <h1
                        className={
                            'text-accent-foreground/90 text-sm font-medium'
                        }
                    >
                        {title}
                    </h1>
                </div>
                <div className={'flex items-center space-x-2'}>
                    {headerActions}
                </div>
            </header>
            <main
                className={cn(
                    'flex h-full w-full grow flex-col p-4 sm:px-6 sm:py-9',
                    center && 'items-center'
                )}
            >
                {children}
            </main>
        </div>
    )
}

export default FullscreenLayout
