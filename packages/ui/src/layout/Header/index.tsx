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
    logoText?: string;
}

export const Header: React.FC<HeaderProps> = ({
                                                  isSidebarOpen,
                                                  toggleSidebar,
                                                  LanguageSelector,
                                                  UserProfileMenu,
                                                  SearchIntegration,
                                                  logoText = "ERGO.AI"
                                              }) => {
    const { t } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
            {/* Left side with menu toggle and optional logo */}
            <div className="flex items-center">
                <button
                    className="text-gray-500 hover:bg-gray-100 p-2 rounded-md"
                    onClick={toggleSidebar}
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Show logo when sidebar is closed */}
                {!isSidebarOpen && (
                    <div className="text-blue-600 font-bold text-xl ml-2">{logoText}</div>
                )}
            </div>

            {/* Search bar */}
            {SearchIntegration}

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
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

                {LanguageSelector}
                {UserProfileMenu}
            </div>
        </header>
    );
};

export default Header;
