import en from '@/locales/en.json'
import zhTW from '@/locales/zh-TW.json'
import { setDefaultOptions } from 'date-fns'
import { zhTW as dateFnsZhTW, enUS } from 'date-fns/locale'
import i18next from 'i18next'
import { z } from 'zod'

// Keys are the English source strings themselves, so `en` only carries plural
// overrides (`<key>_one`): a missing entry falls back to the key, which is
// already the English copy. Every other locale translates every key.
export const locales = {
    'en': { label: 'English', resources: en as Record<string, string> },
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
    showSupportNotice: false,
})

document.documentElement.lang = locale

setDefaultOptions({ locale: locale === 'zh-TW' ? dateFnsZhTW : enUS })

export const t = i18next.t.bind(i18next)

// Validation messages for schemas that don't pass their own. English keeps
// zod's defaults; other locales phrase the common cases through the catalog
// and fall back to zod's bundled locale for the rest.
if (locale === 'zh-TW') {
    const fallback = z.locales.zhTW().localeError
    z.config({
        localeError: issue => {
            const size = (value: number | bigint) => Number(value)
            switch (issue.code) {
                case 'too_small':
                    if (issue.origin === 'string')
                        return size(issue.minimum) <= 1
                            ? t('This field is required.')
                            : t('Must be at least {{min}} characters.', {
                                  min: size(issue.minimum),
                              })
                    if (issue.origin === 'array' || issue.origin === 'set')
                        return t('Select at least {{min}}.', {
                            min: size(issue.minimum),
                        })
                    return issue.inclusive
                        ? t('Must be at least {{min}}.', {
                              min: size(issue.minimum),
                          })
                        : t('Must be greater than {{min}}.', {
                              min: size(issue.minimum),
                          })
                case 'too_big':
                    if (issue.origin === 'string')
                        return t('Must be at most {{max}} characters.', {
                            max: size(issue.maximum),
                        })
                    if (issue.origin === 'array' || issue.origin === 'set')
                        return t('Select at most {{max}}.', {
                            max: size(issue.maximum),
                        })
                    return issue.inclusive
                        ? t('Must be at most {{max}}.', {
                              max: size(issue.maximum),
                          })
                        : t('Must be less than {{max}}.', {
                              max: size(issue.maximum),
                          })
                case 'invalid_type':
                    return issue.input === undefined ||
                        issue.input === null ||
                        issue.input === ''
                        ? t('This field is required.')
                        : t('Invalid value.')
                case 'invalid_format':
                    if (issue.format === 'email')
                        return t('Enter a valid email address.')
                    if (issue.format === 'url') return t('Enter a valid URL.')
                    if (issue.format === 'ipv4')
                        return t('Enter a valid IPv4 address.')
                    if (issue.format === 'ipv6')
                        return t('Enter a valid IPv6 address.')
                    return t('Invalid format.')
                case 'invalid_value':
                    return t('Choose one of the available options.')
                case 'not_multiple_of':
                    return t('Must be a multiple of {{divisor}}.', {
                        divisor: issue.divisor,
                    })
                default:
                    return fallback(issue)
            }
        },
    })
}

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
