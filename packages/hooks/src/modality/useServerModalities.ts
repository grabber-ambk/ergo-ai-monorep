// packages/hooks/src/modality/useServerModalities.ts
import { useState, useEffect, useRef } from 'react';

interface Modality {
    id: string;
    name: string;
}

interface UseServerModalitiesOptions {
    locale?: string;
    onError?: (error: Error) => void;
}

export function useServerModalities(options: UseServerModalitiesOptions = {}) {
    const { locale = 'en', onError } = options;
    const simplifiedLocale = locale.substring(0, 2);

    const [modalities, setModalities] = useState<Modality[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Use uma ref para controlar se já fizemos o fetch
    const hasFetched = useRef(false);

    useEffect(() => {
        // Só faz o fetch uma vez
        if (hasFetched.current) return;

        const fetchModalities = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/modalities?locale=${simplifiedLocale}`);

                if (!response.ok) {
                    throw new Error(`Erro ao buscar modalidades: ${response.status}`);
                }

                const data = await response.json();
                setModalities(data);
            } catch (error) {
                const err = error instanceof Error ? error : new Error('Erro desconhecido');
                setError(err);

                if (onError) {
                    onError(err);
                } else {
                    console.error('Erro ao buscar modalidades:', err);
                }
            } finally {
                setIsLoading(false);
                hasFetched.current = true;
            }
        };

        fetchModalities();

        // Dependência vazia para garantir que o effect só rode uma vez
    }, []); // Intencionalmente deixado vazio

    return {
        modalities,
        isLoading,
        error
    };
}
