import React from 'react';
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
interface QuoteProviderProps {
    children: React.ReactNode;
    resetUpload?: () => void;
}
export declare const QuoteProvider: React.FC<QuoteProviderProps>;
export declare const useQuoteContext: () => QuoteContextType;
export default QuoteProvider;
