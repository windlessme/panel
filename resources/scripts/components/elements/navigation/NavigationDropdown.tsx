import { Locale, locale, locales, setLocale } from '@/lib/i18n'
import { useStoreState } from '@/state'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useMatch, useNavigate } from 'react-router-dom'

import ContentContainer from '@/components/elements/ContentContainer'

interface LinkProps {
    children: ReactNode
    onClick: () => void
    to: string
}
const NavLink = ({ children, onClick, to }: LinkProps) => {
    return (
        <Link
            className='flex items-center h-12 border-b border-accent-200 bg-transparent active:bg-accent-100 transition-colors'
            to={to}
            onClick={onClick}
        >
            <span>{children}</span>
        </Link>
    )
}

interface Props {
    logout: () => void
    onClose: () => void
    visible?: boolean
}

const NavigationDropdown = ({ logout, onClose, visible }: Props) => {
    const user = useStoreState(state => state.user.data)
    const isAdminArea = useMatch('/admin/*')
    const { t: tAuth } = useTranslation('auth')
    const { t: tStrings } = useTranslation('strings')

    useEffect(() => {
        if (visible) {
            document.body.classList.add('fixed', 'w-full')
        } else {
            document.body.classList.remove('fixed', 'w-full')
        }
    }, [visible])

    return (
        <>
            {visible && (
                <div
                    className={`inset-x-0 ${
                        isAdminArea ? 'top-[80px]' : 'top-[56px]'
                    } pt-1.5 bottom-0 block fixed bg-background z-[3000] overflow-y-scroll`}
                >
                    <ContentContainer>
                        <div className='flex flex-col w-full'>
                            {user?.rootAdmin ? (
                                <NavLink to='/admin' onClick={onClose}>
                                    {tStrings('admin_cp')}
                                </NavLink>
                            ) : null}
                            <div className='flex items-center justify-between h-12 border-b border-accent-200'>
                                <span>{tStrings('language')}</span>
                                <div className='flex gap-3'>
                                    {(Object.keys(locales) as Locale[]).map(
                                        code => (
                                            <button
                                                key={code}
                                                lang={locales[code].html}
                                                className={`bg-transparent ${
                                                    code === locale
                                                        ? 'font-semibold text-foreground'
                                                        : 'text-accent-500'
                                                }`}
                                                onClick={() => setLocale(code)}
                                            >
                                                {locales[code].label}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                            <button
                                className='flex items-center h-12 border-b border-accent-200 bg-transparent active:bg-accent-100 transition-colors'
                                onClick={logout}
                            >
                                <span>{tAuth('sign_out')}</span>
                            </button>
                        </div>
                    </ContentContainer>
                </div>
            )}
        </>
    )
}

export default NavigationDropdown
