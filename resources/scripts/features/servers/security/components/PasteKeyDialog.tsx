import { useState } from 'react'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import {
    ResponsiveDialog,
    ResponsiveDialogBody,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from '@/components/ui/ResponsiveDialog'
import { Textarea } from '@/components/ui/Textarea'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Receives the non-empty lines pasted; these are added to this server only. */
    onAdd: (keys: string[]) => void
}

const PasteKeyDialog = ({ open, onOpenChange, onAdd }: Props) => {
    const [value, setValue] = useState('')

    const close = (next: boolean) => {
        onOpenChange(next)
        if (!next) setTimeout(() => setValue(''), 200)
    }

    const add = () => {
        const keys = value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)

        if (keys.length === 0) return

        onAdd(keys)
        close(false)
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={close}>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {t('Paste a one-off key')}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {t(
                            'Added to this server only — it isn’t saved to your keychain. One key per line.'
                        )}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <ResponsiveDialogBody className={'space-y-2'}>
                    <Label htmlFor={'paste-key'}>{t('Public key')}</Label>
                    <Textarea
                        id={'paste-key'}
                        rows={4}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={'ssh-ed25519 AAAA… user@host'}
                        className={'font-mono text-xs'}
                    />
                </ResponsiveDialogBody>
                <ResponsiveDialogFooter className={'mt-4'}>
                    <ResponsiveDialogClose
                        render={
                            <Button variant={'outline'} type={'button'}>
                                {t('Cancel')}
                            </Button>
                        }
                    />
                    <Button onClick={add} disabled={value.trim().length === 0}>
                        {t('Add key')}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default PasteKeyDialog
