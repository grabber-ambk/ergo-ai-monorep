'use client'

import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLocale, useTranslation } from '@ergo-ai/i18n';

export const LanguageSelector = () => {
    const { locale, setLocale } = useLocale();
    const { t } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getCurrentLanguageName = () => {
        switch(locale) {
            case 'pt': return 'Português';
            case 'en': return 'English';
            case 'es': return 'Español';
            default: return 'Português';
        }
    };

    const handleLanguageChange = () => {
        const languages = ['pt', 'en', 'es'];
        const currentIndex = languages.indexOf(locale);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLanguage = languages[nextIndex];
        setLocale(nextLanguage);
    };

    // Renderiza um placeholder até o componente ser montado no cliente
    if (!isMounted) {
        return <div className="flex items-center">
            <div className="w-[18px] h-[18px] mr-1"></div>
            <div className="relative inline-block text-left">
                <button className="inline-flex items-center gap-x-1 text-sm font-semibold">
                    {getCurrentLanguageName()}
                    <div className="w-[14px] h-[14px]"></div>
                </button>
            </div>
        </div>;
    }

    return (
        <div className="flex items-center">
            <Globe size={18} className="text-gray-500 mr-1" />
            <div className="relative inline-block text-left">
                <div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-x-1 text-sm font-semibold"
                        onClick={handleLanguageChange}
                    >
                        {getCurrentLanguageName()}
                        <ChevronDown size={14} className="text-gray-400" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};
