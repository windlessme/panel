import { preloadNode, useNode } from '@/features/nodes/api.ts'
import useTitle from '@/hooks/use-title.ts'
import { processAxiosError } from '@/utils/http.ts'
import {
    IconDatabase,
    IconLayoutGrid,
    IconMapPins,
    IconServer,
    IconSettings,
    IconWifi,
} from '@tabler/icons-react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import AppLayout from '@/components/layouts/AppLayout.tsx'

import { SidebarNav } from '@/components/ui/Navigation/Navigation.types.ts'

export const Route = createFileRoute('/_app/admin/nodes/$nodeId')({
    loader: ({ params: { nodeId } }) =>
        preloadNode(Number(nodeId)).catch(processAxiosError),
    component: NodeLayout,
    staticData: {
        title: t('Dashboard'),
    },
})

function NodeLayout() {
    const { nodeId } = Route.useParams()
    const { data: node } = useNode(Number(nodeId))
    useTitle(node?.displayName)

    const nav: SidebarNav = {
        key: `admin-node:${nodeId}`,
        back: { label: t('Nodes'), to: '/admin/nodes' },
        context: {
            title: node?.displayName ?? t('Node'),
            subtitle: node?.fqdn,
            icon: IconServer,
        },
        groups: [
            {
                items: [
                    {
                        icon: IconLayoutGrid,
                        label: t('Overview'),
                        path: `/admin/nodes/${nodeId}`,
                        activeOptions: {
                            exact: true,
                        },
                    },
                    {
                        icon: IconServer,
                        label: t('Servers'),
                        path: `/admin/nodes/${nodeId}/servers`,
                    },
                ],
            },
            {
                label: t('Resources'),
                items: [
                    {
                        icon: IconDatabase,
                        label: t('Storages'),
                        path: `/admin/nodes/${nodeId}/storages`,
                    },
                    {
                        icon: IconWifi,
                        label: t('Network'),
                        path: `/admin/nodes/${nodeId}/network`,
                    },
                    {
                        icon: IconMapPins,
                        label: 'IPAM',
                        path: `/admin/nodes/${nodeId}/ipam`,
                    },
                ],
            },
            {
                label: t('Configuration'),
                items: [
                    {
                        icon: IconSettings,
                        label: t('Settings'),
                        path: `/admin/nodes/${nodeId}/settings`,
                    },
                ],
            },
        ],
    }

    return (
        <AppLayout routes={nav}>
            <Outlet />
        </AppLayout>
    )
}
