import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { getSimplifiedLocale } from './settings'

export const defaultNS = 'common'
export const fallbackLng = 'pt-BR'
export const supportedLanguages = ['pt-BR', 'en-US', 'es-ES']

export function getOptions(lng = fallbackLng, ns = defaultNS) {
    // Converter para formato simplificado para compatibilidade com arquivos de tradução
    const simplifiedLng = getSimplifiedLocale(lng);

    return {
        supportedLngs: supportedLanguages,
        fallbackLng,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns,
    }
}

export async function createI18nInstance(lng: string, ns?: string) {
    const i18nInstance = createInstance()
    const simplifiedLng = getSimplifiedLocale(lng);

    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((language: string, namespace: string) =>
            import(`../../../apps/web/public/locales/${getSimplifiedLocale(language)}/${namespace}.json`)))
        .init(getOptions(lng, ns))

    return i18nInstance
}
