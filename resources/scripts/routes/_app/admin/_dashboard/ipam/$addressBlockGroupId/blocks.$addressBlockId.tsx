import {
    preloadAddressBlock,
    useAddressBlock,
} from '@/features/ipam/blocks/api.ts'
import useTitle from '@/hooks/use-title.ts'
import { processAxiosError } from '@/utils/http.ts'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute(
    '/_app/admin/_dashboard/ipam/$addressBlockGroupId/blocks/$addressBlockId'
)({
    loader: ({ params: { addressBlockGroupId, addressBlockId } }) =>
        preloadAddressBlock(
            Number(addressBlockGroupId),
            Number(addressBlockId)
        ).catch(processAxiosError),
    component: AddressBlockLayout,
    staticData: {
        title: t('IP Block'),
    },
})

function AddressBlockLayout() {
    const { data: block } = useAddressBlock()

    useTitle(block?.name ?? `${block?.baseIp}/${block?.prefixLengthFrom}`)

    return (
        <>
            <Outlet />
        </>
    )
}
