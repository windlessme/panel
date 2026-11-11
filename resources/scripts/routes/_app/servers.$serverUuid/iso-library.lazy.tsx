import ISOLibraryCard from '@/features/servers/media/components/ISOLibraryCard.tsx'
import { createLazyFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import Heading from '@/components/ui/Typography/Heading.tsx'

export const Route = createLazyFileRoute(
    '/_app/servers/$serverUuid/iso-library'
)({
    component: ServerISOLibrary,
    // @ts-ignore
    meta: () => [{ title: t('ISO Library') }],
})

function ServerISOLibrary() {
    const { serverUuid } = Route.useParams()

    return (
        <>
            <Heading>{t('ISO Library')}</Heading>
            <ISOLibraryCard uuid={serverUuid} />
        </>
    )
}
