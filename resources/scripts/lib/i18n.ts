import { setDefaultOptions } from 'date-fns'
import { enUS, zhTW } from 'date-fns/locale'
import i18n from 'i18next'
import I18NextHttpBackend, { HttpBackendOptions } from 'i18next-http-backend'
import I18NextMultiloadBackendAdapter from 'i18next-multiload-backend-adapter'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'

// Locale codes match the directories under lang/ (Crowdin's
// %locale_with_underscore%), since the backend loads them by name.
export const locales = {
    en_US: { label: 'English', html: 'en', dateFns: enUS },
    zh_TW: { label: '繁體中文', html: 'zh-Hant-TW', dateFns: zhTW },
} as const

export type Locale = keyof typeof locales

const STORAGE_KEY = 'locale'

const isLocale = (value: unknown): value is Locale =>
    typeof value === 'string' && value in locales

const detectLocale = (): Locale => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (isLocale(stored)) return stored
    } catch {
        // Storage can be unavailable (private mode); fall back to the browser.
    }

    for (const language of navigator.languages ?? [navigator.language]) {
        const lower = language.toLowerCase()
        if (lower.startsWith('zh')) return 'zh_TW'
        if (lower.startsWith('en')) return 'en_US'
    }

    return 'en_US'
}

export const locale: Locale = detectLocale()

document.documentElement.lang = locales[locale].html
setDefaultOptions({ locale: locales[locale].dateFns })

// If we're using HMR use a unique hash per page reload so that we're always
// doing cache busting. Otherwise just use the builder provided hash value in
// the URL to allow cache busting to occur whenever the front-end is rebuilt.
const hash = Date.now().toString(16)

i18n.use(I18NextMultiloadBackendAdapter)
    .use(initReactI18next)
    .init({
        // debug: process.env.DEBUG === 'true',
        lng: locale,
        fallbackLng: 'en_US',
        // Only ever request the exact locale codes above; never "zh" or "en".
        load: 'currentOnly',
        keySeparator: '.',
        backend: {
            backend: I18NextHttpBackend,
            backendOption: {
                loadPath:
                    '/locales/locale.json?locale={{lng}}&namespace={{ns}}',
                queryStringParams: { hash },
                allowMultiLoading: true,
            } as HttpBackendOptions,
        } as Record<string, any>,
        interpolation: {
            // Per i18n-react documentation: this is not needed since React is already
            // handling escapes for us.
            escapeValue: false,
        },
    })

i18n.loadNamespaces('zod')
z.setErrorMap(zodI18nMap)

/**
 * Persist the choice and reload, so every lazily loaded namespace, date and
 * server-rendered message comes back in the new language together.
 */
export const setLocale = (next: Locale) => {
    if (next === locale) return
    try {
        localStorage.setItem(STORAGE_KEY, next)
    } catch {
        // Ignore; the reload falls back to browser detection.
    }
    window.location.reload()
}

export default i18n
