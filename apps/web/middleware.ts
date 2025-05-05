// apps/web/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSimplifiedLocale, locales, defaultLocale, simplifiedLocales } from '@ergo-ai/i18n/src/settings';

export function middleware(request: NextRequest) {
    // Obter o pathname
    const pathname = request.nextUrl.pathname;

    // Ignorar arquivos estáticos e API
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Verificar o primeiro segmento do path
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    // Verificar se o primeiro segmento é um locale válido
    const isValidLocale = firstSegment &&
        (Object.values(simplifiedLocales).includes(firstSegment) ||
            locales.includes(firstSegment));

    // Se for um locale completo (pt-BR), redirecionar para simplificado (pt)
    if (isValidLocale && locales.includes(firstSegment)) {
        const simplified = getSimplifiedLocale(firstSegment);
        const remainingPath = segments.slice(1).join('/');
        return NextResponse.redirect(
            new URL(`/${simplified}${remainingPath ? '/' + remainingPath : ''}`, request.url)
        );
    }

    // Se não houver locale, detectar idioma do navegador e redirecionar
    if (!isValidLocale) {
        // Obter idioma preferido do navegador
        const acceptLanguage = request.headers.get('accept-language') || '';
        let browserLocale = getSimplifiedLocale(defaultLocale);

        // Tentar encontrar um locale correspondente
        const languages = acceptLanguage.split(',')
            .map(lang => lang.split(';')[0].trim());

        for (const lang of languages) {
            const simplified = getSimplifiedLocale(lang);
            if (Object.values(simplifiedLocales).includes(simplified)) {
                browserLocale = simplified;
                break;
            }
        }

        // Redirecionar para URL com locale simplificado
        return NextResponse.redirect(
            new URL(`/${browserLocale}${pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
