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
