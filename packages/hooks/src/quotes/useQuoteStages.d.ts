export type QuoteStage = 'upload' | 'confirm' | 'result';
export declare const useQuoteStages: (initialStage?: QuoteStage) => {
    quoteStage: QuoteStage;
    setQuoteStage: import("react").Dispatch<import("react").SetStateAction<QuoteStage>>;
    quoteData: any;
    setQuoteData: import("react").Dispatch<any>;
    activeTab: string;
    setActiveTab: import("react").Dispatch<import("react").SetStateAction<string>>;
    handleGenerateQuote: () => void;
    handleGenerateAdvancedQuote: () => void;
    handleConfirmQuote: () => void;
    handleNewQuote: (resetUpload?: () => void) => void;
    handleTabChange: (tab: string) => void;
    mockQuoteData: {
        borrower: {
            name: string;
            taxId: string;
            address: string;
            zipCode: string;
            city: string;
            state: string;
            email: string;
        };
        beneficiary: {
            name: string;
            taxId: string;
            address: string;
            zipCode: string;
            city: string;
            state: string;
        };
        guarantee: {
            type: string;
            coverage: string;
            value: number;
            startDate: string;
            endDate: string;
            days: number;
            reference: string;
            proposal: string;
            purpose: string;
        };
        premium: number;
    };
};
export default useQuoteStages;
