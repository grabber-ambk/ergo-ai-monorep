// packages/ui/src/client/CoverageSelectorClient.tsx
'use client'

import React from 'react';
import { useTranslation } from '@ergo-ai/i18n/src/client';
import { ChevronDown } from 'lucide-react';
import { useServerCoverages } from '@ergo-ai/hooks/src/coverage/useServerCoverages';

interface CoverageSelectorClientProps {
    modalityId?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isDisabled?: boolean;
}

export function CoverageSelectorClient({
                                           modalityId,
                                           value = '',
                                           onChange,
                                           isDisabled: externalDisabled = false
                                       }: CoverageSelectorClientProps) {
    const { t } = useTranslation();

    const { coverages, isLoading, error } = useServerCoverages(modalityId, {
        onError: (err) => console.error('Erro ao carregar coberturas:', err.message)
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    const isDisabled = externalDisabled || !modalityId || isLoading;

    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">
                {t('coverages')}
            </label>
            <div className="relative">
                <select
                    name="cobertura"
                    value={value}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    disabled={isDisabled}
                >
                    <option value="">
                        {isLoading
                            ? t('loading')
                            : !modalityId
                                ? t('select_modality_first')
                                : t('select_coverage')}
                    </option>
                    {coverages.map((coverage) => (
                        <option key={coverage.id} value={coverage.name}>
                            {coverage.name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <ChevronDown size={18} />
                </div>
            </div>
            {error && !isDisabled && (
                <div className="mt-1 text-sm text-red-600">
                    {t('error_loading_coverages')}
                </div>
            )}
        </div>
    );
}
