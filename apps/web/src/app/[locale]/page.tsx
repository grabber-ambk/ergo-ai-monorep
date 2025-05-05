// src/app/[locale]/page.tsx
import { LocaleProvider } from '@ergo-ai/i18n';
import ErgoSingleHome from '../../components/ErgoSingleHome'

// Versão corrigida para Next.js 15
export default async function LocalePage({
                                             params
                                         }: {
    params: Promise<{ locale: string }>
}) {
    // Aguardar a resolução da Promise de params
    const { locale } = await params;

    return (
        <LocaleProvider>
            <ErgoSingleHome />
        </LocaleProvider>
    );
}
