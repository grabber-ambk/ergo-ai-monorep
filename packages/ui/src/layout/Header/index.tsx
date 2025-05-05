// Header/index.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useTranslation } from '@ergo-ai/i18n/src/client';

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    LanguageSelector: React.ReactNode;
    UserProfileMenu: React.ReactNode;
    SearchIntegration: React.ReactNode;
    logoUrl?: string;
    logoText?: string;
}

export const Header: React.FC<HeaderProps> = ({
                                                  isSidebarOpen,
                                                  toggleSidebar,
                                                  LanguageSelector,
                                                  UserProfileMenu,
                                                  SearchIntegration,
                                                  logoUrl = "/images/ergo-logo.png",
                                                  logoText = ""
                                              }) => {
    const { t } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center shadow-sm">
            {/* Lado esquerdo com botão do menu e logo opcional */}
            <div className="flex items-center min-w-[180px]">
                <button
                    className="text-gray-500 hover:bg-gray-100 p-2 rounded-md"
                    onClick={toggleSidebar}
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Mostra o logo quando a barra lateral está fechada */}
                {!isSidebarOpen && (
                    <div className="flex items-center ml-2">
                        <img
                            src={logoUrl}
                            alt={logoText}
                            className="h-8 mr-2"
                        />
                        <span className="text-blue-600 font-bold text-xl">{logoText}</span>
                    </div>
                )}
            </div>

            {/* Barra de busca com margem adicional */}
            <div className="flex-1 mx-6">
                {SearchIntegration}
            </div>

            {/* Ações do lado direito */}
            <div className="flex items-center space-x-4 flex-shrink-0">
                <button
                    className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
                    title={t('configure')}
                >
                    {isMounted ? (
                        <Settings size={18} />
                    ) : (
                        <div className="w-[18px] h-[18px]"></div>
                    )}
                </button>

                {/* Renderizar o LanguageSelector apenas no lado do cliente para evitar erros de hidratação */}
                {isMounted && LanguageSelector}
                {UserProfileMenu}
            </div>
        </header>
    );
};

export default Header;
