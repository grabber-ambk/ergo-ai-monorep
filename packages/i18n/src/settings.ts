//lib/i18n/settings.ts
// Função completa a ser alterada:
// Modificar para usar o formato completo dos locales
export const locales = ['pt-BR', 'en-US', 'es-ES'];
export const defaultLocale = 'pt-BR';

// Mapeamento para simplificado (para compatibilidade)
export const simplifiedLocales = {
    'pt-BR': 'pt',
    'en-US': 'en',
    'es-ES': 'es'
};

// Função para obter o locale simplificado
export function getSimplifiedLocale(locale: string) {
    // Primeiro tenta o mapeamento exato
    if (locale in simplifiedLocales) {
        return simplifiedLocales[locale as keyof typeof simplifiedLocales];
    }

    // Se não encontrar, tenta extrair apenas o código do idioma (pt, en, es)
    if (locale && locale.length >= 2) {
        const baseLanguage = locale.substring(0, 2);
        if (['pt', 'en', 'es'].includes(baseLanguage)) {
            return baseLanguage;
        }
    }

    // Retorna 'pt' como fallback
    return 'pt';
}

export function getBrowserLanguage(): string {
    if (typeof window === 'undefined') return getSimplifiedLocale(defaultLocale);

    // Obter o idioma do navegador
    const browserLang = navigator.language || (navigator as any).userLanguage;

    // Retornar o locale simplificado
    return getSimplifiedLocale(browserLang);
}
