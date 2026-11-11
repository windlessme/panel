import { sshKeyAlgorithm } from '@/features/account/ssh-keys/api.ts'
import { SSHKey as Key } from '@/features/account/types.ts'
import { IconKeyFilled, IconTrash } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useMemo } from 'react'

import { t } from '@/lib/i18n.ts'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/Item'

interface Props {
    publicKey: Key
    onDelete: (key: Key) => void
}

const SSHKey = ({ publicKey: key, onDelete }: Props) => {
    const formattedDate = useMemo(
        () => format(key.createdAt, 'MMMM do, yyyy'),
        [key.createdAt]
    )

    return (
        <Item variant={'muted'} size={'sm'}>
            <ItemMedia variant={'icon'}>
                <IconKeyFilled />
            </ItemMedia>
            <ItemContent className={'overflow-x-hidden'}>
                <ItemTitle className={'truncate'}>{key.name}</ItemTitle>
                <div className={'flex flex-wrap items-center gap-x-2 gap-y-1'}>
                    <Badge
                        variant={'secondary'}
                        className={'shrink-0 font-mono whitespace-nowrap'}
                    >
                        {sshKeyAlgorithm(key.publicKey)}
                    </Badge>
                    <span
                        className={
                            'text-muted-foreground text-xs whitespace-nowrap'
                        }
                    >
                        {t('Added {{formattedDate}}', { formattedDate })}
                    </span>
                </div>
            </ItemContent>
            <ItemActions>
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    aria-label={t('Delete SSH key')}
                    onClick={() => onDelete(key)}
                >
                    <IconTrash className={'h-4 w-4'} />
                </Button>
            </ItemActions>
        </Item>
    )
}

export default SSHKey
