// hooks/useAllActiveModalities.ts
'use client'

import { useState, useEffect } from 'react';
import { getActiveModalies } from '@ergo-ai/api-client';
import { ModalityWithTranslations } from '@ergo-ai/api-client';

export function useAllActiveModalities() {
    const [data, setData] = useState<ModalityWithTranslations[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchModalities = async () => {
            try {
                setIsLoading(true);
                const modalitiesData = await getActiveModalies();
                setData(modalitiesData);
                setError(null);
            } catch (err) {
                console.error('Error fetching modalities:', err);
                setError(err instanceof Error ? err : new Error('Erro ao buscar modalidades'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchModalities();
    }, []);

    return { data, isLoading, error };
}
