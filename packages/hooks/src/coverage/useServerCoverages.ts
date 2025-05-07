// packages/hooks/src/coverage/useServerCoverages.ts
import { useState, useEffect, useRef } from 'react';

interface Coverage {
    id: string;
    name: string;
}

interface UseServerCoveragesOptions {
    onError?: (error: Error) => void;
}

export function useServerCoverages(modalityName: string | undefined, options: UseServerCoveragesOptions = {}) {
    const { onError } = options;

    const [coverages, setCoverages] = useState<Coverage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Use uma ref para rastrear a última modalidade que buscamos
    const lastFetchedModality = useRef<string | null>(null);

    useEffect(() => {
        // Resetar coberturas se não houver modalidade
        if (!modalityName) {
            setCoverages([]);
            setError(null);
            return;
        }

        // Não buscar novamente se a modalidade não mudou
        if (lastFetchedModality.current === modalityName) {
            return;
        }

        const controller = new AbortController();

        const fetchCoverages = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/coverages?modalityName=${encodeURIComponent(modalityName)}`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar coberturas: ${response.status}`);
                }

                const data = await response.json();
                setCoverages(data);
                lastFetchedModality.current = modalityName;
            } catch (error) {
                // Ignorar erros de abortamento
                if ((error as any).name === 'AbortError') return;

                const err = error instanceof Error ? error : new Error('Erro desconhecido');
                setError(err);

                if (onError) {
                    onError(err);
                } else {
                    console.error('Erro ao buscar coberturas:', err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchCoverages();

        // Cleanup function para abortar a requisição quando o componente desmonta
        return () => {
            controller.abort();
        };
    }, [modalityName]); // Removemos onError das dependências para evitar re-renders

    return {
        coverages,
        isLoading,
        error
    };
}
