export declare const formatDateToBR: (date: Date) => string;
export declare const calculateEndDate: (startDate: string, days: number) => string;
export declare const useDateCalculations: () => {
    formatDateToBR: (date: Date) => string;
    calculateEndDate: (startDate: string, days: number) => string;
    today: string;
    defaultDays: number;
    defaultEndDate: string;
};
export default useDateCalculations;
