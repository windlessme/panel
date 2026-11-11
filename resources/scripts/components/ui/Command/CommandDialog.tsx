import type { ComponentProps, ReactNode } from 'react'

import { t } from '@/lib/i18n.ts'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog'

import { Command } from '.'

// Base UI's Root children also accept a render function; this dialog only ever
// takes plain nodes, so narrow rather than thread the function form through.
type CommandDialogProps = Omit<ComponentProps<typeof Dialog>, 'children'> & {
    children?: ReactNode
}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
    return (
        <Dialog {...props}>
            <DialogContent className='overflow-hidden p-0'>
                <DialogTitle className='sr-only'>
                    {t('Command menu')}
                </DialogTitle>
                <Command>{children}</Command>
            </DialogContent>
        </Dialog>
    )
}

export default CommandDialog
