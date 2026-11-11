import useTitle from '@/hooks/use-title.ts'
import {
    IconAnchor,
    IconGauge,
    IconMail,
    IconRefresh,
    IconSettings,
    IconUserCog,
} from '@tabler/icons-react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import AppLayout from '@/components/layouts/AppLayout.tsx'

import { SidebarNav } from '@/components/ui/Navigation/Navigation.types.ts'

export const Route = createFileRoute('/_app/admin/settings')({
    component: SettingsLayout,
    staticData: {
        title: t('Settings'),
    },
})

// One route per section, drilled in from the admin console. Only add an item
// here once its route file exists — a nav that points at nothing is how the
// client server tabs ended up declared-but-missing.
const nav: SidebarNav = {
    key: 'admin-settings',
    back: { label: t('Admin'), to: '/admin' },
    context: {
        title: t('Settings'),
        subtitle: 'Panel-wide defaults',
        icon: IconSettings,
    },
    groups: [
        {
            items: [
                {
                    icon: IconGauge,
                    label: t('Bandwidth'),
                    path: '/admin/settings/bandwidth',
                },
                {
                    icon: IconAnchor,
                    label: t('Anchor'),
                    path: '/admin/settings/anchor',
                },
                {
                    icon: IconUserCog,
                    label: t('Accounts'),
                    path: '/admin/settings/account',
                },
                {
                    icon: IconMail,
                    label: t('Mail'),
                    path: '/admin/settings/mail',
                },
                {
                    icon: IconRefresh,
                    label: t('Updates'),
                    path: '/admin/settings/updates',
                },
            ],
        },
    ],
}

function SettingsLayout() {
    useTitle('Settings')

    return (
        <AppLayout routes={nav}>
            <Outlet />
        </AppLayout>
    )
}
