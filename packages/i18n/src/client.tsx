'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useEffect } from 'react'
import React, { createContext, useContext, useState, useCallback } from 'react'
import {getSimplifiedLocale, locales, defaultLocale, simplifiedLocales} from './settings'

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
    // Usar o idioma do navegador como inicial se estivermos no cliente e não houver locale na URL
    const [locale, setLocaleState] = useState(() => {
        if (typeof window !== 'undefined') {
            // Verificar se já temos um locale na URL
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            if (pathSegments.length > 0) {
                const firstSegment = pathSegments[0];
                // Verificar se o primeiro segmento é um locale conhecido
                if (Object.values(simplifiedLocales).includes(firstSegment) ||
                    locales.includes(firstSegment)) {
                    return getSimplifiedLocale(firstSegment);
                }
            }

            // Se não houver locale na URL, usar o idioma do navegador
            const browserLang = navigator.language || (navigator as any).userLanguage;
            return getSimplifiedLocale(browserLang);
        }

        // No servidor, usar o locale padrão
        return getSimplifiedLocale(defaultLocale);
    });

    const setLocale = useCallback((newLocale: string) => {
        if (typeof window === 'undefined') return;

        const simplifiedLocale = getSimplifiedLocale(newLocale);

        // Atualizar o estado do locale
        setLocaleState(simplifiedLocale);

        // Analisar o pathname atual
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);

        // Verificar se o primeiro segmento é um locale conhecido
        const isLocaleSegment = segments.length > 0 &&
            (Object.values(simplifiedLocales).includes(segments[0]) ||
                locales.includes(segments[0]));

        let newPath;
        if (isLocaleSegment) {
            // Substituir o segmento do locale
            segments[0] = simplifiedLocale;
            newPath = '/' + segments.join('/');
        } else {
            // Adicionar o locale no início
            newPath = '/' + simplifiedLocale + path;
        }

        // Atualizar a URL sem recarregar a página
        window.history.pushState(null, '', newPath);
        console.log(`Idioma alterado para ${simplifiedLocale}`);
    }, []);

    // Efeito para atualizar o locale com base na URL quando ela muda
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleURLChange = () => {
                const pathSegments = window.location.pathname.split('/').filter(Boolean);
                if (pathSegments.length > 0) {
                    const firstSegment = pathSegments[0];
                    if (Object.values(simplifiedLocales).includes(firstSegment) ||
                        locales.includes(firstSegment)) {
                        const newLocale = getSimplifiedLocale(firstSegment);
                        if (newLocale !== locale) {
                            setLocaleState(newLocale);
                        }
                    }
                }
            };

            // Escutar mudanças na URL (navegação de volta/avançar)
            window.addEventListener('popstate', handleURLChange);

            return () => {
                window.removeEventListener('popstate', handleURLChange);
            };
        }
    }, [locale]);

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
