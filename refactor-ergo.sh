#!/bin/bash

# Script de refatoração do componente ErgoSingleHome para arquitetura modular
# Autor: Claude
# Versão: 1.0

set -e # Para o script se houver qualquer erro

echo "🚀 Iniciando refatoração modular do componente ErgoSingleHome..."

# Verificar se o diretório de trabalho existe
if [ ! -d "apps/web/src/components" ]; then
    echo "❌ Diretório apps/web/src/components não encontrado. Execute este script na raiz do projeto monorepo."
    exit 1
fi

# Função para criar diretório se não existir
create_dir_if_not_exists() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo "✅ Criado diretório: $1"
    fi
}

# Criar estrutura de diretórios
echo "📁 Criando estrutura de diretórios para código modular..."

# Diretórios para pacotes
create_dir_if_not_exists "packages/ui/src/layout/Sidebar"
create_dir_if_not_exists "packages/ui/src/layout/Header"
create_dir_if_not_exists "packages/ui/src/layout/MainLayout"
create_dir_if_not_exists "packages/ui/src/common/LanguageSelector"
create_dir_if_not_exists "packages/ui/src/common/UserProfileMenu"
create_dir_if_not_exists "packages/hooks/src/quotes"
create_dir_if_not_exists "packages/hooks/src/date"
create_dir_if_not_exists "packages/features/src/quotes"
create_dir_if_not_exists "packages/features/src/auth"

# Backup do componente original
echo "📦 Criando backup do componente original..."
cp "apps/web/src/components/ErgoSingleHome.tsx" "apps/web/src/components/ErgoSingleHome.tsx.bak"
echo "✅ Backup criado: apps/web/src/components/ErgoSingleHome.tsx.bak"

# Extrair hooks de data
echo "🔄 Extraindo hooks de utilidades de data..."
cat > "packages/hooks/src/date/useDateCalculations.ts" << 'EOL'
import { useState } from 'react';

export const formatDateToBR = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const calculateEndDate = (startDate: string, days: number): string => {
    const [day, month, year] = startDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return formatDateToBR(date);
};

export const useDateCalculations = () => {
    const today = formatDateToBR(new Date());
    const defaultDays = 365;
    const defaultEndDate = calculateEndDate(today, defaultDays);

    return {
        formatDateToBR,
        calculateEndDate,
        today,
        defaultDays,
        defaultEndDate
    };
};

export default useDateCalculations;
EOL
echo "✅ Criado hook: packages/hooks/src/date/useDateCalculations.ts"

# Extrair hook para formulário avançado
echo "🔄 Extraindo hook para formulário avançado..."
cat > "packages/hooks/src/quotes/useAdvancedForm.ts" << 'EOL'
import { useState } from 'react';
import { useDateCalculations } from '../date/useDateCalculations';

export const useAdvancedForm = (initialValues = {}) => {
    const { today, defaultDays, defaultEndDate, calculateEndDate } = useDateCalculations();

    // Estado inicial mesclado com os defaults
    const defaultFormData = {
        modalidade: '',
        startDate: today,
        endDate: defaultEndDate,
        days: defaultDays.toString(),
        guaranteeValue: 'R$ 0,00',
        currency: 'BRL',
        comissaoCorretorValue: 'R$ 0,00',
        comissaoCorretorPercentage: '20,00%',
        comissaoAgravada: 'R$ 0,00',
        taxa: '5,00%'
    };

    const [formData, setFormData] = useState({ ...defaultFormData, ...initialValues });

    // Handler para mudanças no formulário
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        // Log para debug
        console.log('Formulário recebeu alteração:', name, value);

        // Verificar se o nome do campo está definido
        if (!name) {
            console.error('Campo sem nome definido:', e);
            return; // Não processar eventos sem nome de campo
        }

        // Caso especial para campos que precisam atualizar outros campos
        if (name === 'startDate') {
            // Quando a data inicial é alterada, recalcular a data final
            const newEndDate = calculateEndDate(value, parseInt(formData.days, 10));
            setFormData(prev => ({
                ...prev,
                [name]: value,
                endDate: newEndDate
            }));
        }
        else if (name === 'days') {
            // Quando os dias são alterados, recalcular a data final
            const days = parseInt(value, 10) || 0;
            const newEndDate = calculateEndDate(formData.startDate, days);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                endDate: newEndDate
            }));
        }
        else if (name === 'endDate') {
            // Quando a data final é alterada, recalcular os dias
            try {
                const [startDay, startMonth, startYear] = formData.startDate.split('/').map(Number);
                const [endDay, endMonth, endYear] = value.split('/').map(Number);

                const startDate = new Date(startYear, startMonth - 1, startDay);
                const endDate = new Date(endYear, endMonth - 1, endDay);

                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    days: diffDays.toString()
                }));
            } catch (error) {
                console.error('Erro ao calcular a diferença de dias:', error);
                // Apenas atualiza a data final sem recalcular os dias em caso de erro
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
        else if (name === 'currency') {
            // Quando a moeda mudar, precisamos reformatar o valor de garantia
            const newCurrency = value;
            const currentValue = formData.guaranteeValue;

            // Extrair o valor numérico da string formatada atual
            // Remover todos os caracteres não numéricos exceto ponto e vírgula
            let numericString = currentValue.replace(/[^\d,.]/g, '');

            // Adaptar o parsing com base na moeda atual
            const currentCurrency = formData.currency;
            let numericValue;

            if (currentCurrency === 'BRL' || currentCurrency === 'EUR') {
                // Para formatos com vírgula como separador decimal
                numericValue = parseFloat(numericString.replace(/\./g, '').replace(',', '.'));
            } else {
                // Para formatos com ponto como separador decimal
                numericValue = parseFloat(numericString.replace(/,/g, ''));
            }

            if (isNaN(numericValue)) numericValue = 0;

            // Configurações para cada moeda
            const currencySettings = {
                'BRL': { symbol: 'R$ ', locale: 'pt-BR', decimalSeparator: ',', thousandSeparator: '.' },
                'USD': { symbol: '$ ', locale: 'en-US', decimalSeparator: '.', thousandSeparator: ',' },
                'EUR': { symbol: '€ ', locale: 'de-DE', decimalSeparator: ',', thousandSeparator: '.' },
                'GBP': { symbol: '£ ', locale: 'en-GB', decimalSeparator: '.', thousandSeparator: ',' }
            };

            // Obter as configurações da nova moeda
            const settings = currencySettings[newCurrency] || currencySettings['BRL'];

            // Formatar o valor para a nova moeda
            const formattedValue = settings.symbol + numericValue.toLocaleString(settings.locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Atualizar o estado com a nova moeda e o valor reformatado
            setFormData(prev => ({
                ...prev,
                currency: newCurrency,
                guaranteeValue: formattedValue
            }));
        }
        else if (name === 'guaranteeValue') {
            // Tratamento especial para o valor de garantia
            try {
                // Obter a moeda atual
                const currentCurrency = formData.currency;

                // Configurações para cada moeda
                const currencySettings = {
                    'BRL': { symbol: 'R$ ', locale: 'pt-BR', decimalSeparator: ',', thousandSeparator: '.' },
                    'USD': { symbol: '$ ', locale: 'en-US', decimalSeparator: '.', thousandSeparator: ',' },
                    'EUR': { symbol: '€ ', locale: 'de-DE', decimalSeparator: ',', thousandSeparator: '.' },
                    'GBP': { symbol: '£ ', locale: 'en-GB', decimalSeparator: '.', thousandSeparator: ',' }
                };

                // Usar as configurações da moeda atual ou padrão para BRL
                const settings = currencySettings[currentCurrency] || currencySettings['BRL'];

                // Verificar se temos um valor formatado completo
                if (value.includes(settings.symbol)) {
                    // Já está formatado como moeda, aceitar como está
                    setFormData(prev => ({
                        ...prev,
                        guaranteeValue: value
                    }));
                    console.log('Valor já formatado aceito:', value);
                    return;
                }

                // Remover qualquer símbolo de moeda e espaços
                let cleanValue = value.replace(/[^\d,.]/g, '');

                // Se vazio, definir como zero
                if (!cleanValue) cleanValue = '0';

                // Adaptar o valor para o formato numérico correto com base na moeda
                let numericValue;

                if (settings.decimalSeparator === ',') {
                    // Para formatos europeus/brasileiros (1.234,56)
                    numericValue = cleanValue.replace(/\./g, '').replace(',', '.');
                } else {
                    // Para formatos americanos/britânicos (1,234.56)
                    numericValue = cleanValue.replace(/,/g, '');
                }

                // Se for vazio ou não numérico, definir como zero
                if (!numericValue || isNaN(parseFloat(numericValue))) {
                    numericValue = '0';
                }

                // Converter para número
                const amount = parseFloat(numericValue);

                // Formatar o valor de acordo com o locale da moeda
                const formattedValue = settings.symbol + amount.toLocaleString(settings.locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                console.log('Valor formatado para moeda:', currentCurrency, formattedValue);

                setFormData(prev => ({
                    ...prev,
                    guaranteeValue: formattedValue
                }));
            } catch (error) {
                console.error('Erro ao formatar valor de garantia:', error);
                // Em caso de erro, manter o valor atual
                setFormData(prev => ({
                    ...prev
                }));
            }
        }
        else {
            // Caso padrão: atualizar o campo normalmente
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        console.log('Estado do formulário atualizado:', name, value);
    };

    // Handler específico para mudança de modalidade
    const handleModalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Este evento será passado para o onChange nas props
        handleFormChange(e);

        // Também atualiza o estado local para refletir a mudança imediatamente
        const newValue = e.target.value;
        console.log("modalidade => ", newValue);

        setFormData(prev => ({
            ...prev,
            modalidade: newValue,
            // Resetar a cobertura quando a modalidade mudar
            cobertura: ""
        }));
    };

    // Handler específico para mudança de cobertura
    const handleCoverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleFormChange(e);

        const newValue = e.target.value;
        console.log("cobertura => ", newValue);

        setFormData(prev => ({
            ...prev,
            cobertura: newValue
        }));
    };

    return {
        formData,
        setFormData,
        handleFormChange,
        handleModalityChange,
        handleCoverageChange
    };
};

export default useAdvancedForm;
EOL
echo "✅ Criado hook: packages/hooks/src/quotes/useAdvancedForm.ts"

# Extrair hook para gerenciamento de estágios da cotação
echo "🔄 Extraindo hook para gerenciamento de estágios da cotação..."
cat > "packages/hooks/src/quotes/useQuoteStages.ts" << 'EOL'
import { useState } from 'react';

export type QuoteStage = 'upload' | 'confirm' | 'result';

export const useQuoteStages = (initialStage: QuoteStage = 'upload') => {
    const [quoteStage, setQuoteStage] = useState<QuoteStage>(initialStage);
    const [quoteData, setQuoteData] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState('simple');

    // Mock data for quotes
    const mockQuoteData = {
        borrower: {
            name: "3S SUPERMERCADO LTDA",
            taxId: "46.189.831/0001-54",
            address: "AVENIDA DOUTOR GENTIL DE MOURA, N.º 370, BOX 03, BAIRRO IPIRANGA",
            zipCode: "04.208-053",
            city: "SÃO PAULO",
            state: "SP",
            email: "3ssupermercado@gmail.com"
        },
        beneficiary: {
            name: "DIA BRASIL SOCIEDADE LIMITADA EM RECUPERAÇÃO JUDICIAL",
            taxId: "03.476.811/0001-51",
            address: "AV IBIRAPUERA, N.º 2.332, BLOCO I - TORRES IBIRAPUERA I, 14º ANDAR, INDIANÓPOLIS",
            zipCode: "04028-900",
            city: "SÃO PAULO",
            state: "SP"
        },
        guarantee: {
            type: "GARANTIA FINANCEIRA",
            coverage: "GARANTIA DE PAGAMENTO",
            value: 200050.00,
            startDate: "29/04/2025",
            endDate: "29/04/2026",
            days: 365,
            reference: "903032025DBSL3SAL1",
            proposal: "ICSMCP903032025",
            purpose: "Garantia total as obrigações assumidas no Contrato de Franquia e contratos acessórios firmados entre as partes."
        },
        premium: 10002.50
    };

    // Handlers para navegação entre estágios
    const handleGenerateQuote = () => {
        console.log("Generating quote...");
        setQuoteData(mockQuoteData);
        setQuoteStage('confirm');
    };

    const handleGenerateAdvancedQuote = () => {
        console.log("Generating quote from advanced form...");
        setQuoteData(mockQuoteData);
        setQuoteStage('confirm');
    };

    const handleConfirmQuote = () => {
        console.log("Confirming quote...");
        setQuoteStage('result');
    };

    const handleNewQuote = (resetUpload?: () => void) => {
        // Se houver uma função de reset de upload, chamá-la
        if (resetUpload) {
            resetUpload();
        }

        setQuoteData(null);
        setQuoteStage('upload');
        setActiveTab('simple');
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return {
        quoteStage,
        setQuoteStage,
        quoteData,
        setQuoteData,
        activeTab,
        setActiveTab,
        handleGenerateQuote,
        handleGenerateAdvancedQuote,
        handleConfirmQuote,
        handleNewQuote,
        handleTabChange,
        mockQuoteData
    };
};

export default useQuoteStages;
EOL
echo "✅ Criado hook: packages/hooks/src/quotes/useQuoteStages.ts"

# Criar arquivo de exportação para hooks
cat > "packages/hooks/src/index.ts" << 'EOL'
export * from './date/useDateCalculations';
export * from './quotes/useAdvancedForm';
export * from './quotes/useQuoteStages';

export { default as useDateCalculations } from './date/useDateCalculations';
export { default as useAdvancedForm } from './quotes/useAdvancedForm';
export { default as useQuoteStages } from './quotes/useQuoteStages';
EOL
echo "✅ Criado arquivo de exportação: packages/hooks/src/index.ts"

# Extrair componente LanguageSelector
echo "🔄 Extraindo componente LanguageSelector..."
cat > "packages/ui/src/common/LanguageSelector/index.tsx" << 'EOL'
import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';

interface LanguageSelectorProps {
    i18n: any;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ i18n }) => {
    const getCurrentLanguageName = () => {
        const currentLanguage = i18n.language;
        switch(currentLanguage) {
            case 'pt': return 'Português';
            case 'en': return 'English';
            case 'es': return 'Español';
            default: return 'Português';
        }
    };

    return (
        <div className="flex items-center">
            <Globe size={18} className="text-gray-500 mr-1" />
            <div className="relative inline-block text-left">
                <div>
                    <button type="button"
                            className="inline-flex items-center gap-x-1 text-sm font-semibold"
                            onClick={() => {
                                // Lista simples de idiomas para alternar
                                const languages = ['pt', 'en', 'es'];
                                const currentIndex = languages.indexOf(i18n.language);
                                const nextIndex = (currentIndex + 1) % languages.length;
                                const nextLanguage = languages[nextIndex];

                                // Mudar idioma usando i18n diretamente
                                i18n.changeLanguage(nextLanguage);

                                // Atualizar URL
                                const path = window.location.pathname;
                                const currentLocalePath = path.split('/')[1];

                                if (['pt', 'en', 'es'].includes(currentLocalePath)) {
                                    const newPath = path.replace(`/${currentLocalePath}`, `/${nextLanguage}`);
                                    window.history.pushState(null, '', newPath);
                                } else {
                                    window.history.pushState(null, '', `/${nextLanguage}${path}`);
                                }

                                console.log(`Idioma alterado para ${nextLanguage}`);
                            }}
                    >
                        {getCurrentLanguageName()}
                        <ChevronDown size={14} className="text-gray-400" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;
EOL
echo "✅ Criado componente: packages/ui/src/common/LanguageSelector/index.tsx"

# Extrair componente UserProfileMenu
echo "🔄 Extraindo componente UserProfileMenu..."
cat > "packages/ui/src/common/UserProfileMenu/index.tsx" << 'EOL'
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface UserProfileMenuProps {
    userName?: string;
    userRole?: string;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
    userName = "Convidado",
    userRole = "Usuário Web"
}) => {
    return (
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center">
                {userName?.charAt(0) || 'M'}
            </div>
            <div className="ml-2 hidden md:block">
                <div className="text-sm font-medium">{userName}</div>
                <div className="text-xs text-gray-500">{userRole}</div>
            </div>
            <ChevronDown size={14} className="ml-1 text-gray-400" />
        </div>
    );
};

export default UserProfileMenu;
EOL
echo "✅ Criado componente: packages/ui/src/common/UserProfileMenu/index.tsx"

# Extrair componente Sidebar
echo "🔄 Extraindo componente Sidebar..."
cat > "packages/ui/src/layout/Sidebar/index.tsx" << 'EOL'
import React from 'react';
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
    return (
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
                    <Plus size={18} className="mr-2" />
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
};

export default Sidebar;
EOL
echo "✅ Criado componente: packages/ui/src/layout/Sidebar/index.tsx"

# Extrair componente Header
echo "🔄 Extraindo componente Header..."
cat > "packages/ui/src/layout/Header/index.tsx" << 'EOL'
import React from 'react';
import { Settings } from 'lucide-react';

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
                <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                    <Settings size={18} />
                </button>

                {LanguageSelector}
                {UserProfileMenu}
            </div>
        </header>
    );
};

export default Header;
EOL
echo "✅ Criado componente: packages/ui/src/layout/Header/index.tsx"

# Extrair componente MainLayout
echo "🔄 Extraindo componente MainLayout..."
cat > "packages/ui/src/layout/MainLayout/index.tsx" << 'EOL'
import React from 'react';

interface MainLayoutProps {
    header: React.ReactNode;
    sidebar: React.ReactNode;
    children: React.ReactNode;
    pageTitle?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    header,
    sidebar,
    children,
    pageTitle = "SIMULADO GARANTIA"
}) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            {sidebar}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                {header}

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
                        <div className="flex items-center">
                            <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Main content container */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-180px)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
EOL
echo "✅ Criado componente: packages/ui/src/layout/MainLayout/index.tsx"

# Criar arquivo de exportação para UI
cat > "packages/ui/src/index.ts" << 'EOL'
// Layout
export * from './layout/Sidebar';
export * from './layout/Header';
export * from './layout/MainLayout';

// Common Components
export * from './common/LanguageSelector';
export * from './common/UserProfileMenu';

// Default exports
export { default as Sidebar } from './layout/Sidebar';
export { default as Header } from './layout/Header';
export { default as MainLayout } from './layout/MainLayout';
export { default as LanguageSelector } from './common/LanguageSelector';
export { default as UserProfileMenu } from './common/UserProfileMenu';
EOL
echo "✅ Criado arquivo de exportação: packages/ui/src/index.ts"

# Criar context provider para cotações
echo "🔄 Criando context provider para cotações..."
create_dir_if_not_exists "packages/features/src/quotes"
cat > "packages/features/src/quotes/QuoteProvider.tsx" << 'EOL'
import React, { createContext, useContext, useState } from 'react';
import { useQuoteStages, useAdvancedForm } from '@ergo-ai/hooks';

// Contexto para gerenciamento de cotações
interface QuoteContextType {
    quoteStage: 'upload' | 'confirm' | 'result';
    setQuoteStage: React.Dispatch<React.SetStateAction<'upload' | 'confirm' | 'result'>>;
    quoteData: any | null;
    setQuoteData: React.Dispatch<React.SetStateAction<any | null>>;
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    formData: any;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleNewQuote: () => void;
    handleGenerateQuote: () => void;
    handleGenerateAdvancedQuote: () => void;
    handleConfirmQuote: () => void;
    handleTabChange: (tab: string) => void;
    mockPreviousQuotesData: Array<{
        id: string;
        company: string;
        date: string;
        value: number;
    }>;
    handleSelectQuote: (quoteId: string) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

interface QuoteProviderProps {
    children: React.ReactNode;
    resetUpload?: () => void;
}

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children, resetUpload }) => {
    const {
        quoteStage,
        setQuoteStage,
        quoteData,
        setQuoteData,
        activeTab,
        setActiveTab,
        handleGenerateQuote: baseHandleGenerateQuote,
        handleGenerateAdvancedQuote: baseHandleGenerateAdvancedQuote,
        handleConfirmQuote,
        handleNewQuote: baseHandleNewQuote,
        handleTabChange
    } = useQuoteStages();

    const { formData, handleFormChange } = useAdvancedForm();

    // Mock previous quotes
    const mockPreviousQuotesData = [
        { id: '1', company: '3S SUPERMERCADO LTDA', date: '20/04/2025', value: 200050.00 },
        { id: '2', company: 'TECH SOLUTIONS SA', date: '15/04/2025', value: 150000.00 },
        { id: '3', company: 'CONSTRUÇÕES SILVA LTDA', date: '10/04/2025', value: 500000.00 }
    ];

    // Wrapper para handleNewQuote que inclui resetUpload
    const handleNewQuote = () => {
        if (resetUpload) {
            resetUpload();
        }
        baseHandleNewQuote();
    };

    // Select a quote from previous quotes
    const handleSelectQuote = async (quoteId: string) => {
        try {
            // In a real app, this would fetch the quote from the API
            console.log(`Selected quote with ID: ${quoteId}`);

            // Encontrar a cotação pelo ID
            const selectedQuote = mockPreviousQuotesData.find(q => q.id === quoteId);

            if (selectedQuote) {
                // Aqui seria normalmente uma chamada para API
                // Por enquanto, apenas usamos dados simulados
                setQuoteData({
                    borrower: {
                        name: selectedQuote.company,
                        taxId: "46.189.831/0001-54",
                        address: "AVENIDA DOUTOR GENTIL DE MOURA, N.º 370, BOX 03, BAIRRO IPIRANGA",
                        zipCode: "04.208-053",
                        city: "SÃO PAULO",
                        state: "SP",
                        email: "contato@exemplo.com"
                    },
                    beneficiary: {
                        name: "DIA BRASIL SOCIEDADE LIMITADA EM RECUPERAÇÃO JUDICIAL",
                        taxId: "03.476.811/0001-51",
                        address: "AV IBIRAPUERA, N.º 2.332, BLOCO I - TORRES IBIRAPUERA I, 14º ANDAR, INDIANÓPOLIS",
                        zipCode: "04028-900",
                        city: "SÃO PAULO",
                        state: "SP"
                    },
                    guarantee: {
                        type: "GARANTIA FINANCEIRA",
                        coverage: "GARANTIA DE PAGAMENTO",
                        value: selectedQuote.value,
                        startDate: selectedQuote.date,
                        endDate: "29/04/2026",
                        days: 365,
                        reference: `${quoteId}032025DBSL3SAL1`,
                        proposal: `ICSMCP${quoteId}032025`,
                        purpose: "Garantia total as obrigações assumidas no Contrato."
                    },
                    premium: selectedQuote.value * 0.05 // 5% do valor da garantia
                });
                setQuoteStage('result');
            } else {
                console.error('Cotação não encontrada');
                alert('Não foi possível encontrar detalhes da cotação. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes da cotação:', error);
            alert('Falha ao carregar detalhes da cotação. Tente novamente.');
        }
    };

    const value: QuoteContextType = {
        quoteStage,
        setQuoteStage,
        quoteData,
        setQuoteData,
        activeTab,
        setActiveTab,
        formData,
        handleFormChange,
        handleNewQuote,
        handleGenerateQuote: baseHandleGenerateQuote,
        handleGenerateAdvancedQuote: baseHandleGenerateAdvancedQuote,
        handleConfirmQuote,
        handleTabChange,
        mockPreviousQuotesData,
        handleSelectQuote
    };

    return (
        <QuoteContext.Provider value={value}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuoteContext = () => {
    const context = useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuoteContext must be used within a QuoteProvider');
    }
    return context;
};

export default QuoteProvider;
EOL
echo "✅ Criado provider: packages/features/src/quotes/QuoteProvider.tsx"

# Extrair AuthProvider
echo "🔄 Extraindo AuthProvider..."
cat > "packages/features/src/auth/AuthProvider.tsx" << 'EOL'
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SignupFormData {
    companyName: string;
    fullName: string;
    taxId: string;
    email: string;
    phone: string;
}

interface AuthContextType {
    showLoginModal: boolean;
    showSignupModal: boolean;
    signupFormData: SignupFormData;
    selectedCountry: string;
    handleOpenLoginModal: () => void;
    handleCloseLoginModal: () => void;
    handleOpenSignupModal: () => void;
    handleCloseSignupModal: () => void;
    handleCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSignupFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSignupSubmit: (e: React.FormEvent) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    showLoginAfterSeconds?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
    showLoginAfterSeconds = 30
}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('BR');

    // Signup form data
    const [signupFormData, setSignupFormData] = useState({
        companyName: '',
        fullName: '',
        taxId: '',
        email: '',
        phone: '+55'
    });

    // Effect to show login modal after specified seconds
    useEffect(() => {
        const loginTimer = setTimeout(() => {
            setShowLoginModal(true);
        }, showLoginAfterSeconds * 1000);

        return () => clearTimeout(loginTimer);
    }, [showLoginAfterSeconds]);

    // Modal handlers
    const handleOpenLoginModal = () => setShowLoginModal(true);
    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleOpenSignupModal = () => {
        setShowSignupModal(true);
        setShowLoginModal(false); // Fechar o modal de login se estiver aberto
    };
    const handleCloseSignupModal = () => setShowSignupModal(false);

    // Handle country change
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = e.target.value;
        setSelectedCountry(country);

        // Reset tax ID field when changing country
        setSignupFormData({
            ...signupFormData,
            taxId: '',
            phone: country === 'BR' ? '+55' : '+1' // Simple example - adjust as needed
        });
    };

    // Handle signup form changes
    const handleSignupFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupFormData({
            ...signupFormData,
            [name]: value
        });
    };

    // Process signup form submission
    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signup data:', signupFormData);
        // Process signup logic here

        // No final, feche o modal
        setTimeout(() => {
            handleCloseSignupModal();
        }, 1000);
    };

    const value: AuthContextType = {
        showLoginModal,
        showSignupModal,
        signupFormData,
        selectedCountry,
        handleOpenLoginModal,
        handleCloseLoginModal,
        handleOpenSignupModal,
        handleCloseSignupModal,
        handleCountryChange,
        handleSignupFormChange,
        handleSignupSubmit
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
EOL
echo "✅ Criado provider: packages/features/src/auth/AuthProvider.tsx"

# Criar arquivo de índice para providers
cat > "packages/features/src/index.ts" << 'EOL'
// Auth
export * from './auth/AuthProvider';
export { default as AuthProvider } from './auth/AuthProvider';

// Quotes
export * from './quotes/QuoteProvider';
export { default as QuoteProvider } from './quotes/QuoteProvider';
EOL
echo "✅ Criado arquivo de exportação: packages/features/src/index.ts"

# Modificar ErgoSingleHome.tsx para usar novos componentes e hooks
echo "🔄 Refatorando o componente ErgoSingleHome..."
cat > "apps/web/src/components/ErgoSingleHome.tsx" << 'EOL'
"use client"

import { useState } from 'react';
import { useTranslation } from "@ergo-ai/i18n";
import { useFileUpload } from "@ergo-ai/hooks";
import { AuthProvider, useAuthContext } from "@ergo-ai/features";
import { QuoteProvider, useQuoteContext } from "@ergo-ai/features";
import {
    MainLayout,
    Sidebar,
    Header,
    LanguageSelector,
    UserProfileMenu
} from "@ergo-ai/ui";

// Import existing components - a seguir seriam migrados gradualmente também
import SignupMultiStepModal from "@/components/SignupMultiStepModal";
import LoginModal from "@/components/LoginModal";
import UploadStageUpdated from "@/components/UploadStageUpdated";
import QuoteConfirm from "@/components/QuoteConfirm";
import QuoteResult from "@/components/QuoteResult";
import PreviousQuotes from "@/components/PreviousQuotes";
import SearchIntegration from "@/components/SearchIntegration";

const ErgoSingleHome = () => {
    const { t, i18n } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [uploadedFilename, setUploadedFilename] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);

    const {
        handleFileSelect,
        resetUpload,
    } = useFileUpload();

    // Toggle sidebar function
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Função para lidar com uploads de arquivos
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filename = 'SEI_64182677_Oficio_121.pdf';
        setUploadedFilename(filename);
        setFileSize('49 KB');
        setFileUploaded(true);

        // Optionally set the actual file if it exists
        if (e?.target?.files?.[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Wrapper para componentes Auth
    const AuthModalWrapper = () => {
        const {
            showLoginModal,
            showSignupModal,
            handleCloseLoginModal,
            handleOpenSignupModal,
            handleCloseSignupModal,
            signupFormData,
            selectedCountry,
            handleCountryChange,
            handleSignupFormChange,
            handleSignupSubmit
        } = useAuthContext();

        return (
            <>
                {showLoginModal && (
                    <LoginModal
                        isOpen={showLoginModal}
                        onClose={handleCloseLoginModal}
                        onSignup={handleOpenSignupModal}
                    />
                )}

                {showSignupModal && (
                    <SignupMultiStepModal
                        isOpen={showSignupModal}
                        onClose={handleCloseSignupModal}
                        signupFormData={signupFormData}
                        selectedCountry={selectedCountry}
                        onCountryChange={handleCountryChange}
                        onSignupFormChange={handleSignupFormChange}
                        onSignupSubmit={handleSignupSubmit}
                    />
                )}
            </>
        );
    };

    // Wrapper para conteúdo principal
    const MainContent = () => {
        const {
            quoteStage,
            quoteData,
            activeTab,
            formData,
            handleFormChange,
            handleNewQuote,
            handleGenerateQuote,
            handleGenerateAdvancedQuote,
            handleConfirmQuote,
            handleTabChange,
            handleSelectQuote,
            mockPreviousQuotesData
        } = useQuoteContext();

        const { handleOpenSignupModal } = useAuthContext();

        return (
            <>
                {quoteStage === 'upload' && (
                    <UploadStageUpdated
                        activeTab={activeTab}
                        handleTabChange={handleTabChange}
                        fileUploaded={fileUploaded}
                        uploadedFilename={uploadedFilename}
                        fileSize={fileSize}
                        advancedFormData={formData}
                        handleAdvancedFormChange={handleFormChange}
                        handleFileSelected={handleFileSelected}
                        handleGenerateQuote={handleGenerateQuote}
                        handleGenerateAdvancedQuote={handleGenerateAdvancedQuote}
                    />
                )}

                {quoteStage === 'confirm' && (
                    <QuoteConfirm
                        quoteData={quoteData}
                        handleNewQuote={handleNewQuote}
                        handleConfirmQuote={handleConfirmQuote}
                    />
                )}

                {quoteStage === 'result' && (
                    <QuoteResult
                        quoteData={quoteData}
                        handleNewQuote={handleNewQuote}
                        handleOpenSignupModal={handleOpenSignupModal}
                    />
                )}
            </>
        );
    };

    // Componentes para layout
    const SidebarComponent = () => {
        const { handleNewQuote, mockPreviousQuotesData, handleSelectQuote } = useQuoteContext();

        return (
            <Sidebar
                isOpen={sidebarOpen}
                onNewQuote={handleNewQuote}
                quotes={mockPreviousQuotesData}
                onSelectQuote={handleSelectQuote}
                PreviousQuotes={PreviousQuotes}
            />
        );
    };

    const HeaderComponent = () => {
        const SearchComponent = ({ onSelectQuote }: { onSelectQuote: (quoteData: any) => void }) => (
            <SearchIntegration onSelectQuote={onSelectQuote} />
        );

        const { setQuoteData, setQuoteStage } = useQuoteContext();

        const handleSearchQuoteSelect = (quoteData: any) => {
            setQuoteData(quoteData);
            setQuoteStage('result');
        };

        return (
            <Header
                isSidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                LanguageSelector={<LanguageSelector i18n={i18n} />}
                UserProfileMenu={<UserProfileMenu />}
                SearchIntegration={<SearchComponent onSelectQuote={handleSearchQuoteSelect} />}
            />
        );
    };

    return (
        <AuthProvider>
            <QuoteProvider resetUpload={resetUpload}>
                <MainLayout
                    header={<HeaderComponent />}
                    sidebar={<SidebarComponent />}
                >
                    <MainContent />
                </MainLayout>
                <AuthModalWrapper />
            </QuoteProvider>
        </AuthProvider>
    );
};

export default ErgoSingleHome;
EOL
echo "✅ Refatorado componente: apps/web/src/components/ErgoSingleHome.tsx"

# Adicionar configuração para transpilação dos pacotes internos no Next.js
echo "🔄 Configurando next.config.js para transpilação dos pacotes internos..."
cat > "apps/web/next.config.js" << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        '@ergo-ai/hooks',
        '@ergo-ai/ui',
        '@ergo-ai/i18n',
        '@ergo-ai/api-client',
        '@ergo-ai/features',
    ],
    experimental: {
        // Outras configurações experimentais...
    },
};

module.exports = nextConfig;
EOL
echo "✅ Configurado next.config.js: apps/web/next.config.js"

# Criar arquivo de exportação para hooks i18n
echo "🔄 Criando arquivo de exportação para i18n..."
create_dir_if_not_exists "packages/i18n/src"
cat > "packages/i18n/src/index.ts" << 'EOL'
// Re-export the same hooks but with namespace changed
export { useTranslation } from '@/lib/i18n/client';
export { default as useLocale } from '@/components/localeProvider';
EOL
echo "✅ Criado arquivo de exportação: packages/i18n/src/index.ts"

# Criar arquivo de exportação para api-client
echo "🔄 Criando arquivo de exportação para api-client..."
create_dir_if_not_exists "packages/api-client/src"
cat > "packages/api-client/src/index.ts" << 'EOL'
// Re-export api client
export * from '@/api';
export * from '@/services/auth';
EOL
echo "✅ Criado arquivo de exportação: packages/api-client/src/index.ts"

# Criar package.json para cada pacote
echo "🔄 Criando package.json para cada pacote..."

# hooks
cat > "packages/hooks/package.json" << 'EOL'
{
  "name": "@ergo-ai/hooks",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "react": "^18.2.0"
  }
}
EOL

# ui
cat > "packages/ui/package.json" << 'EOL'
{
  "name": "@ergo-ai/ui",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "react": "^18.2.0",
    "lucide-react": "^0.263.1"
  }
}
EOL

# i18n
cat > "packages/i18n/package.json" << 'EOL'
{
  "name": "@ergo-ai/i18n",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
EOL

# api-client
cat > "packages/api-client/package.json" << 'EOL'
{
  "name": "@ergo-ai/api-client",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
EOL

# features
cat > "packages/features/package.json" << 'EOL'
{
  "name": "@ergo-ai/features",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "react": "^18.2.0",
    "@ergo-ai/hooks": "workspace:*",
    "@ergo-ai/ui": "workspace:*"
  }
}
EOL
echo "✅ Criados package.json para cada pacote"

# Criar tsconfig.json para cada pacote
echo "🔄 Criando tsconfig.json para cada pacote..."

# Criar um tsconfig.base.json comum
cat > "packages/tsconfig.base.json" << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@ergo-ai/hooks": ["hooks/src"],
      "@ergo-ai/hooks/*": ["hooks/src/*"],
      "@ergo-ai/ui": ["ui/src"],
      "@ergo-ai/ui/*": ["ui/src/*"],
      "@ergo-ai/i18n": ["i18n/src"],
      "@ergo-ai/i18n/*": ["i18n/src/*"],
      "@ergo-ai/api-client": ["api-client/src"],
      "@ergo-ai/api-client/*": ["api-client/src/*"],
      "@ergo-ai/features": ["features/src"],
      "@ergo-ai/features/*": ["features/src/*"]
    }
  },
  "exclude": ["node_modules"]
}
EOL

# Criar tsconfig.json para cada pacote
for pkg in hooks ui i18n api-client features; do
  cat > "packages/$pkg/tsconfig.json" << EOL
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
EOL
done

echo "✅ Criados tsconfig.json para cada pacote"

# Atualizar o turbo.json na raiz do projeto
echo "🔄 Atualizando turbo.json na raiz do projeto..."
cat > "turbo.json" << 'EOL'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOL
echo "✅ Atualizado turbo.json"

# Atualizar o package.json na raiz do projeto para adicionar pacotes como workspaces
echo "🔄 Atualizando package.json na raiz do projeto..."
cat > "package.json" << 'EOL'
{
  "name": "ergo-ai-surety-bond",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "cd apps/web && pnpm start",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "eslint": "^8.36.0",
    "prettier": "^2.8.3",
    "turbo": "^1.11.0"
  },
  "packageManager": "pnpm@7.15.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
EOL
echo "✅ Atualizado package.json"

# Resumo das alterações
echo "
🎉 Refatoração completa! O componente ErgoSingleHome foi modularizado para a estrutura de monorepo.

📂 Estrutura criada:
  - packages/hooks: Lógica reutilizável
  - packages/ui: Componentes de UI
  - packages/i18n: Utilitários de internacionalização
  - packages/api-client: Cliente de API
  - packages/features: Providers e lógica de negócio

🔄 Próximos passos:
  1. Execute 'pnpm install' para instalar as dependências
  2. Execute 'pnpm dev' para iniciar o ambiente de desenvolvimento
  3. Continue migrando outros componentes específicos gradualmente

⚠️ Importante:
  - O arquivo ErgoSingleHome.tsx.bak contém o backup do componente original
  - Esta é uma refatoração progressiva, mantenha o backup até validar todas as funcionalidades

✅ O monorepo está configurado para desenvolvimento contínuo com as melhores práticas.
"

echo "Script concluído com sucesso!"
