export declare const useAdvancedForm: (initialValues?: {}) => {
    formData: {
        modalidade: string;
        startDate: string;
        endDate: string;
        days: string;
        guaranteeValue: string;
        currency: string;
        comissaoCorretorValue: string;
        comissaoCorretorPercentage: string;
        comissaoAgravada: string;
        taxa: string;
    };
    setFormData: import("react").Dispatch<import("react").SetStateAction<{
        modalidade: string;
        startDate: string;
        endDate: string;
        days: string;
        guaranteeValue: string;
        currency: string;
        comissaoCorretorValue: string;
        comissaoCorretorPercentage: string;
        comissaoAgravada: string;
        taxa: string;
    }>>;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleModalityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleCoverageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
export default useAdvancedForm;
