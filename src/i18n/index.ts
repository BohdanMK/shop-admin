import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import uk from './locales/uk'

if (!i18n.isInitialized) {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                uk,
                en,
            },
            supportedLngs: ['uk', 'en'],
            fallbackLng: 'uk',
            load: 'languageOnly',
            defaultNS: 'common',
            ns: ['common', 'nav', 'breadcrumbs', 'auth', 'product', 'settings', 'tables', 'filters', 'forms', 'messages', 'dashboard'],
            interpolation: {
                escapeValue: false,
            },
            detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage'],
                lookupLocalStorage: 'i18nextLng',
            },
        })
}

export default i18n
