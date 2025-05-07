// packages/ui/src/hooks/useModalityCoverages.ts
//packages/hooks/src/modality/

import { useState } from 'react';
import { Modality, Coverage } from '../types';

export function useModalityCoverages(initialModalities: Modality[]) {
    const [selectedModality, setSelectedModality] = useState('');
    const [coverages, setCoverages] = useState<Coverage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleModalityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelectedModality(newValue);

        setCoverages([]);

        if (!newValue) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/coverages?modalityName=${encodeURIComponent(newValue)}`);
            if (response.ok) {
                const data = await response.json();
                setCoverages(data);
            }
        } catch (error) {
            console.error('Erro ao buscar coberturas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        selectedModality,
        coverages,
        isLoading,
        handleModalityChange
    };
}
