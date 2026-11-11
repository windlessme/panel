import { setDefaultOptions } from 'date-fns'
import { enUS, zhTW as dateFnsZhTW } from 'date-fns/locale'
import i18next from 'i18next'
import { z } from 'zod'

import zhTW from '@/locales/zh-TW.json'

// Keys are the English source strings themselves, so `en` needs no catalog:
// a missing translation falls back to the key, which is already the English
// copy. Only non-English locales ship a JSON file.
export const locales = {
    'en': { label: 'English', resources: {} as Record<string, string> },
    'zh-TW': { label: '繁體中文', resources: zhTW as Record<string, string> },
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
        // Storage can be unavailable (private mode); fall through to the browser.
    }

    for (const language of navigator.languages ?? [navigator.language]) {
        const lower = language.toLowerCase()
        if (lower.startsWith('zh')) return 'zh-TW'
        if (lower.startsWith('en')) return 'en'
    }

    return 'en'
}

export const locale: Locale = detectLocale()

// Initialised synchronously (resources are bundled), so module-level `t()`
// calls in any file that imports this one already see the active language.
void i18next.init({
    lng: locale,
    fallbackLng: false,
    resources: Object.fromEntries(
        Object.entries(locales).map(([code, { resources }]) => [
            code,
            { translation: resources },
        ])
    ),
    keySeparator: false,
    nsSeparator: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    initAsync: false,
})

document.documentElement.lang = locale

setDefaultOptions({ locale: locale === 'zh-TW' ? dateFnsZhTW : enUS })

if (locale === 'zh-TW') {
    z.config(z.locales.zhTW())
}

export const t = i18next.t.bind(i18next)

/**
 * Strings are resolved when modules evaluate (column definitions, zod schemas,
 * route titles), so switching language reloads the page rather than trying to
 * re-render everything in place.
 */
export const setLocale = (next: Locale) => {
    if (next === locale) return
    try {
        localStorage.setItem(STORAGE_KEY, next)
    } catch {
        // Ignore; the reload will fall back to browser detection.
    }
    window.location.reload()
}

export default i18next
