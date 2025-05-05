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
