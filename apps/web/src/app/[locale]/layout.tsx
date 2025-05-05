// src/app/[locale]/layout.tsx
import '../globals.css'
import '../grid-styles.css'
import type { Metadata } from 'next'
import { supportedLanguages } from "@ergo-ai/i18n/src/server"
import Providers from "../providers";


export async function generateStaticParams() {
    return supportedLanguages.map((locale) => ({ locale }))
}

// Metadados estáticos que não dependem do locale para evitar erros
export const metadata: Metadata = {
    title: 'Ergo.AI',
    description: 'Surety Bond Application',
}

export default function LocaleLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    // Função síncrona que não usa params.locale diretamente
    return (
        <div className="h-full">
            <Providers>{children}</Providers>
        </div>
    )
}
