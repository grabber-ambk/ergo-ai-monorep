'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useEffect } from 'react'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { getSimplifiedLocale, locales, defaultLocale } from './settings'

// Inicializa i18next
i18next
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) =>
        import(`../../../apps/web/public/locales/${getSimplifiedLocale(language)}/${namespace}.json`)))
    .init({
        fallbackLng: defaultLocale,
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false
        }
    })

// Criar o contexto de locale
type LocaleContextType = {
    locale: string
    setLocale: (locale: string) => void
}

const LocaleContext = createContext<LocaleContextType>({
    locale: getSimplifiedLocale(defaultLocale),
    setLocale: () => {},
})

// Hook para usar o contexto
export function useLocale() {
    return useContext(LocaleContext);
}

// Provider para o contexto
export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState(getSimplifiedLocale(defaultLocale));

    const setLocale = useCallback((newLocale: string) => {
        if (typeof window === 'undefined') return;

        const simplifiedLocale = getSimplifiedLocale(newLocale);

        // Atualizar o estado do locale
        setLocaleState(simplifiedLocale);

        // Atualizar a URL sem recarregar a página
        const path = window.location.pathname;
        const currentLocalePart = path.split('/')[1];

        // Verificar se o caminho atual já contém um locale
        const simplifiedLocales = Object.values(locales).map(l => typeof l === 'string' ? getSimplifiedLocale(l) : '');
        if (simplifiedLocales.includes(currentLocalePart)) {
            const newPath = path.replace(`/${currentLocalePart}`, `/${simplifiedLocale}`);
            window.history.pushState(null, '', newPath);
        } else {
            window.history.pushState(null, '', `/${simplifiedLocale}${path}`);
        }

        console.log(`Idioma alterado para ${simplifiedLocale}`);
    }, []);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

// Hook de tradução que sincroniza com o contexto de locale
export function useTranslation(ns = 'common') {
    const ret = useTranslationOrg(ns);
    const { i18n } = ret;
    const { locale } = useLocale();

    // Atualiza o idioma quando o locale muda
    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale, i18n]);

    return ret;
}
