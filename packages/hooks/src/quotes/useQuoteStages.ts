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
