import { IconAlertTriangle } from '@tabler/icons-react'
import { ComponentProps } from 'react'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'

import SimpleEmptyState from './SimpleEmptyState.tsx'

interface Props extends ComponentProps<'div'> {
    onRetry?: () => void
    title?: string
    description?: string
}

const CollectionErrorState = ({
    onRetry,
    title = t('Couldn’t load this content'),
    description = t(
        'Try again. If the problem continues, check your connection.'
    ),
    ...props
}: Props) => (
    <SimpleEmptyState
        {...props}
        icon={IconAlertTriangle}
        title={title}
        description={description}
        action={
            onRetry ? (
                <Button variant={'outline'} onClick={() => onRetry()}>
                    {t('Try again')}
                </Button>
            ) : undefined
        }
    />
)

export default CollectionErrorState
