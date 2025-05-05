

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Ergo.AI - Cotação de Seguro Garantia',
    description: 'Carregue seu contrato e tenha uma cotação em minutos com Ergo.AI',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt">
        <body className={inter.className}>{children}</body>
        </html>
    );
}
