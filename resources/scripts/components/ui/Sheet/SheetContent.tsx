import { cn } from '@/utils'
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { IconX } from '@tabler/icons-react'
import type { VariantProps } from 'class-variance-authority'

import { t } from '@/lib/i18n.ts'

import { SheetPortal } from '@/components/ui/Sheet'
import sheetVariants from '@/components/ui/Sheet/Sheet.variants.ts'
import SheetOverlay from '@/components/ui/Sheet/SheetOverlay.tsx'

export interface SheetContentProps
    extends
        Omit<SheetPrimitive.Popup.Props, 'className'>,
        VariantProps<typeof sheetVariants> {
    className?: string
}

const SheetContent = ({
    side = 'right',
    className,
    children,
    ...props
}: SheetContentProps) => (
    <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Popup
            data-slot={'sheet-content'}
            className={cn(sheetVariants({ side }), className)}
            {...props}
        >
            {children}
            <SheetPrimitive.Close
                className={
                    'ring-offset-background focus-visible:ring-ring/50 absolute top-4 right-4 rounded-sm opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-3 disabled:pointer-events-none'
                }
            >
                <IconX className={'size-4'} />
                <span className={'sr-only'}>{t('Close')}</span>
            </SheetPrimitive.Close>
        </SheetPrimitive.Popup>
    </SheetPortal>
)
SheetContent.displayName = 'SheetContent'

export default SheetContent
