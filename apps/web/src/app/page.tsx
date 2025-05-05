// src/app/page.tsx
import { redirect } from 'next/navigation';
//import { defaultLocale } from "@ergo-ai/i18n/src/settings";
import { getSimplifiedLocale, defaultLocale } from "@ergo-ai/i18n/src/settings";


export default function Home() {
    //redirect(`/${defaultLocale}`);
    redirect(`/${getSimplifiedLocale(defaultLocale)}`);
}

/*

export default function Home() {
    return (
        <meta httpEquiv="refresh" content="0;url=/pt-BR" />
    );
}


 */
