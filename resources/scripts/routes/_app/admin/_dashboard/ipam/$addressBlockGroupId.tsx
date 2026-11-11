import {
    preloadAddressBlockGroup,
    useAddressBlockGroup,
} from '@/features/ipam/api.ts'
import useTitle from '@/hooks/use-title.ts'
import { processAxiosError } from '@/utils/http.ts'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

export const Route = createFileRoute(
    '/_app/admin/_dashboard/ipam/$addressBlockGroupId'
)({
    loader: ({ params: { addressBlockGroupId } }) =>
        preloadAddressBlockGroup(Number(addressBlockGroupId)).catch(
            processAxiosError
        ),
    component: BlockGroupsLayout,
    staticData: {
        title: t('IP Block Group'),
    },
})

function BlockGroupsLayout() {
    const { data: group } = useAddressBlockGroup()

    useTitle(group?.name)

    return (
        <>
            <Outlet />
        </>
    )
}
