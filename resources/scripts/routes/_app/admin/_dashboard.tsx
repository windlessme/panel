import useTitle from '@/hooks/use-title.ts'
import {
    IconBoxMargin,
    IconDatabase,
    IconDisc,
    IconHistory,
    IconHome,
    IconKey,
    IconMapPin,
    IconMapPins,
    IconServer,
    IconSettings,
    IconStack2,
    IconTransform,
    IconUsers,
} from '@tabler/icons-react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import AppLayout from '@/components/layouts/AppLayout.tsx'

import { SidebarNav } from '@/components/ui/Navigation/Navigation.types.ts'

export const Route = createFileRoute('/_app/admin/_dashboard')({
    component: () => {
        useTitle()

        return (
            <AppLayout routes={nav}>
                <Outlet />
            </AppLayout>
        )
    },
    staticData: {
        title: t('Dashboard'),
    },
})

const nav: SidebarNav = {
    key: 'admin',
    groups: [
        {
            items: [
                {
                    icon: IconHome,
                    label: t('Dashboard'),
                    path: '/admin',
                    activeOptions: {
                        exact: true,
                    },
                },
            ],
        },
        {
            label: t('Infrastructure'),
            items: [
                {
                    icon: IconMapPin,
                    label: t('Locations'),
                    path: '/admin/locations',
                },
                {
                    icon: IconServer,
                    label: t('Nodes'),
                    path: '/admin/nodes',
                },
                {
                    icon: IconTransform,
                    label: t('Anchors'),
                    path: '/admin/anchors',
                },
                {
                    icon: IconServer,
                    label: t('Servers'),
                    path: '/admin/servers',
                },
            ],
        },
        {
            label: t('Provisioning'),
            items: [
                {
                    icon: IconMapPins,
                    label: 'IPAM',
                    path: '/admin/ipam',
                },
                {
                    icon: IconDatabase,
                    label: t('Storage'),
                    path: '/admin/storage',
                },
                {
                    icon: IconBoxMargin,
                    label: t('Images'),
                    path: '/admin/images',
                },
                {
                    icon: IconDisc,
                    label: t('ISOs'),
                    path: '/admin/isos',
                },
                {
                    icon: IconStack2,
                    label: t('Server Presets'),
                    path: '/admin/server-presets',
                },
            ],
        },
        {
            label: t('Administration'),
            items: [
                {
                    icon: IconUsers,
                    label: t('Users'),
                    path: '/admin/users',
                },
                {
                    icon: IconKey,
                    label: t('API Tokens'),
                    path: '/admin/tokens',
                },
                {
                    icon: IconHistory,
                    label: t('Audit Log'),
                    path: '/admin/audit-log',
                },
                {
                    icon: IconSettings,
                    label: t('Settings'),
                    path: '/admin/settings',
                },
            ],
        },
    ],
}
