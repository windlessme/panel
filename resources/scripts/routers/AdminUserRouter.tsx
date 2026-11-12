import { lazyLoad, query } from '@/routers/helpers'
import { Route } from '@/routers/router'
import { lazy, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import getUser from '@/api/admin/users/getUser'
import useUserSWR, { getKey } from '@/api/admin/users/useUserSWR'

import { NavigationBarContext } from '@/components/elements/navigation/NavigationBar'


export const routes: Route[] = [
    {
        path: 'users',
        children: [
            {
                index: true,
                element: lazyLoad(
                    lazy(
                        () => import('@/components/admin/users/UsersContainer')
                    )
                ),
            },
            {
                path: ':id',
                element: lazyLoad(lazy(() => import('./AdminUserRouter'))),
                loader: async ({ params }) => {
                    try {
                        const id = parseInt(params.id!);
                        const user = await query(getKey(id), () => getUser(id));
                        return user;
                    } catch (error) {
                        return null;
                    }
                },
                children: [
                    {
                        path: 'settings',
                        element: lazyLoad(
                            lazy(
                                () =>
                                    import(
                                        '@/components/admin/users/settings/UserSettingsContainer'
                                    )
                            )
                        ),
                        children: [
                            {
                                path: 'general',
                                element: lazyLoad(
                                    lazy(
                                        () =>
                                            import(
                                                '@/components/admin/users/settings/GeneralContainer'
                                            )
                                    )
                                ),
                            },
                        ],
                    },
                    {
                        path: 'servers',
                        element: lazyLoad(
                            lazy(
                                () =>
                                    import(
                                        '@/components/admin/users/servers/UserServersContainer'
                                    )
                            )
                        ),
                    },
                ],
            },
        ],
    },
]

const AdminUserRouter = () => {
    const { t: tStrings } = useTranslation('strings')
    const visibleRoutes = [
        {
            name: tStrings('setting_other'),
            path: '/admin/users/:id/settings',
        },
        {
            name: tStrings('server_other'),
            path: '/admin/users/:id/servers',
        },
    ]

    const { setRoutes, setBreadcrumb } = useContext(NavigationBarContext)
    const { data: user } = useUserSWR()

    useEffect(() => {
        setRoutes(visibleRoutes)

        return () => setBreadcrumb(null)
    }, [])

    useEffect(() => {
        setBreadcrumb(user.name)
    }, [user.name])

    return <Outlet />
}

export default AdminUserRouter