// hooks/useCoveragesByModality.ts
'use client'

import { useState, useEffect } from 'react';
import { getCoveragesByModalityName } from '@ergo-ai/api-client';

interface Coverage {
    id: string;
    name: string;
}

export function useCoveragesByModality(modalityId: string) {
    const [data, setData] = useState<Coverage[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Reset state when modalityId changes
        setData(null);
        setError(null);

        // Don't fetch if no modalityId is provided
        if (!modalityId) {
            setData([]);
            return;
        }

        const fetchCoverages = async () => {
            try {
                setIsLoading(true);

                // Log the modalityId to help with debugging
                console.log('Fetching coverages for modalityId:', modalityId);

                const coverages = await getCoveragesByModalityName(modalityId);

                if (coverages && Array.isArray(coverages)) {
                    setData(coverages);
                    console.log('Successfully fetched coverages:', coverages);
                } else {
                    console.warn('API returned unexpected data format:', coverages);
                    setData([]);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching coverages:', err);
                setError(err instanceof Error ? err : new Error('Erro ao buscar coberturas'));
                setData([]);  // Set empty array to avoid null checks
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoverages();
    }, [modalityId]);  // Only re-run when modalityId changes

    return { data, isLoading, error };
}
