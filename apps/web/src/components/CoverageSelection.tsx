// components/CoverageSelection.tsx
'use client'

import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCoveragesByModality } from '@ergo-ai/hooks/src/useCoveragesByModality';
import { useTranslation } from '@ergo-ai/i18n/src/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface CoverageSelectionProps {
    modalityId: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isDisabled?: boolean;
}

// Componente externo que fornece o QueryClientProvider
const CoverageSelection: React.FC<CoverageSelectionProps> = (props) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <CoverageSelectionInner {...props} />
        </QueryClientProvider>
    );
};

// Componente interno que usa o useCoveragesByModality
const CoverageSelectionInner: React.FC<CoverageSelectionProps> = ({
                                                                      modalityId,
                                                                      value,
                                                                      onChange,
                                                                      isDisabled = false
                                                                  }) => {
    const { t } = useTranslation();

    // Dados estáticos para fallback
    const staticCoverages = useMemo(() => [
        { id: 'garantiaPagamento', name: 'GARANTIA DE PAGAMENTO' },
        { id: 'outras_coberturas', name: 'OUTRAS COBERTURAS' }
    ], []);

    const {
        data: coverages,
        isLoading,
        error
    } = useCoveragesByModality(modalityId);

    // Se não houver uma modalidade selecionada, mostramos o select desabilitado
    if (!modalityId) {
        return (
            <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1">
                    {t('coberturas', 'Coberturas')}
                </label>
                <div className="relative">
                    <select
                        name="cobertura"
                        value=""
                        disabled={true}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-gray-100 cursor-not-allowed"
                    >
                        <option value="" disabled>
                            {t('select_a_modality_first', 'Selecione uma modalidade primeiro')}
                        </option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1">
                    {t('coberturas', 'Coberturas')}
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 animate-pulse h-12"></div>
            </div>
        );
    }

    // Se houver erro ou nenhuma cobertura, usar dados estáticos
    const displayCoverages = (!coverages || coverages.length === 0 || error) ? staticCoverages : coverages;

    if (error) {
        console.log('Usando dados estáticos devido a erro na API:', error);
    }

    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">
                {t('coberturas', 'Coberturas')}
            </label>
            <div className="relative">
                <select
                    name="cobertura"
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none ${
                        isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                >
                    <option value="" disabled>
                        {t('select_a_coverage', 'Selecione uma cobertura')}
                    </option>
                    {displayCoverages.map((coverage) => (
                        <option key={coverage.id} value={coverage.name}>
                            {coverage.name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown size={18} />
                </div>
            </div>
        </div>
    );
};

export default CoverageSelection;
