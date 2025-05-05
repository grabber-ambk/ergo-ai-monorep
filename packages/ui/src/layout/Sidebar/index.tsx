'use client'

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onNewQuote: () => void;
    quotes: Array<{
        id: string;
        company: string;
        date: string;
        value: number;
    }>;
    onSelectQuote: (quoteId: string) => void;
    PreviousQuotes: React.ComponentType<{
        quotes: any[];
        onSelectQuote: (quoteId: string) => void;
    }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    isOpen,
                                                    onNewQuote,
                                                    quotes,
                                                    onSelectQuote,
                                                    PreviousQuotes
                                                }) => {
    const [isMounted, setIsMounted] = useState(false);

    // Efeito para definir isMounted como true após a montagem do componente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Template comum para ambas as renderizações
    const renderContent = () => (
        <div className={`${isOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
            {/* Logo */}
            <div className="p-4 flex items-center h-16">
                <div className="text-blue-600 font-bold text-xl">ERGO.AI</div>
            </div>

            {/* Create Quote Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={onNewQuote}
                    className="bg-indigo-600 text-white rounded-lg py-2.5 px-4 w-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                    {isMounted ? (
                        <Plus size={18} className="mr-2" />
                    ) : (
                        <div className="w-[18px] h-[18px] mr-2"></div>
                    )}
                    <span>Criar Nova Cotação</span>
                </button>
            </div>

            {/* Previous Quotes */}
            <div className="px-4 flex-1 overflow-y-auto">
                <div className="font-semibold text-gray-900 mb-4">Cotações Anteriores</div>
                <PreviousQuotes
                    quotes={quotes}
                    onSelectQuote={onSelectQuote}
                />
            </div>
        </div>
    );

    return renderContent();
};

export default Sidebar;
