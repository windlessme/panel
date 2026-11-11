import { Session as SessionType } from '@/features/account/sessions/api.ts'
import { IconDeviceLaptop } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
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
    session: SessionType
    onRevoke: (session: SessionType) => void
}

const Session = ({ session, onRevoke }: Props) => {
    const lastActive = useMemo(
        () => formatDistanceToNow(session.lastActiveAt, { addSuffix: true }),
        [session.lastActiveAt]
    )

    return (
        <Item variant={'muted'} size={'sm'}>
            <ItemMedia variant={'icon'}>
                <IconDeviceLaptop />
            </ItemMedia>
            <ItemContent className={'overflow-x-hidden'}>
                <ItemTitle className={'truncate'}>
                    {session.device}
                    {session.isCurrent && (
                        <Badge variant={'secondary'}>{t('This device')}</Badge>
                    )}
                </ItemTitle>
                <p className={'text-muted-foreground text-xs'}>
                    {session.ipAddress ?? t('Unknown IP')}{' '}
                    {t('· active {{lastActive}}', { lastActive })}
                </p>
            </ItemContent>
            {!session.isCurrent && (
                <ItemActions>
                    <Button variant={'ghost'} onClick={() => onRevoke(session)}>
                        {t('Revoke')}
                    </Button>
                </ItemActions>
            )}
        </Item>
    )
}

export default Session
