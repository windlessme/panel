import { preloadUser, useUser } from '@/features/users/api.ts'
import useTitle from '@/hooks/use-title.ts'
import { processAxiosError } from '@/utils/http.ts'
import {
    IconHistory,
    IconKey,
    IconLayoutGrid,
    IconServer,
    IconShieldLock,
    IconUser,
} from '@tabler/icons-react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { t } from '@/lib/i18n.ts'

import AppLayout from '@/components/layouts/AppLayout.tsx'

import { SidebarNav } from '@/components/ui/Navigation/Navigation.types.ts'

export const Route = createFileRoute('/_app/admin/users/$userId')({
    loader: ({ params: { userId } }) =>
        preloadUser(Number(userId)).catch(processAxiosError),
    component: UserLayout,
    staticData: {
        // Names the section, not the row: the breadcrumb then reads "Users > Overview", and the
        // account's own name is already the sidebar's context header.
        title: t('Users'),
    },
})

function UserLayout() {
    const { userId } = Route.useParams()
    const { data: user } = useUser(Number(userId))
    useTitle(user?.name)

    const nav: SidebarNav = {
        key: `admin-user:${userId}`,
        back: { label: t('Users'), to: '/admin/users' },
        context: {
            title: user?.name ?? t('User'),
            subtitle: user?.email,
            icon: IconUser,
        },
        groups: [
            {
                items: [
                    {
                        icon: IconLayoutGrid,
                        label: t('Overview'),
                        path: `/admin/users/${userId}`,
                        activeOptions: {
                            exact: true,
                        },
                    },
                    {
                        icon: IconServer,
                        label: t('Servers'),
                        path: `/admin/users/${userId}/servers`,
                    },
                ],
            },
            {
                label: t('Access'),
                items: [
                    {
                        icon: IconShieldLock,
                        label: t('Security'),
                        path: `/admin/users/${userId}/security`,
                    },
                    {
                        icon: IconKey,
                        label: t('API keys'),
                        path: `/admin/users/${userId}/api-keys`,
                    },
                ],
            },
            {
                label: t('History'),
                items: [
                    {
                        icon: IconHistory,
                        label: t('Activity'),
                        path: `/admin/users/${userId}/activity`,
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
