// packages/ui/src/client/ModalitySelectionClient.tsx
'use client'

import React from 'react';
import { useTranslation } from '@ergo-ai/i18n/src/client';
import { ChevronDown } from 'lucide-react';
import { useServerModalities } from '@ergo-ai/hooks/src/modality/useServerModalities';

interface ModalitySelectionClientProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    locale?: string;
}

export function ModalitySelectionClient({
                                            value = '',
                                            onChange,
                                            locale = 'en'
                                        }: ModalitySelectionClientProps) {
    const { t } = useTranslation();

    const { modalities, isLoading, error } = useServerModalities({
        locale,
        onError: (err) => console.error('Erro ao carregar modalidades:', err.message)
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">
                {t('modalities')}
            </label>
            <div className="relative">
                <select
                    name="modalidade"
                    value={value}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    disabled={isLoading}
                >
                    <option value="">{isLoading ? t('loading') : t('select_modality')}</option>
                    {modalities.map((modality) => (
                        <option key={modality.id} value={modality.name}>
                            {modality.name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <ChevronDown size={18} />
                </div>
            </div>
            {error && (
                <div className="mt-1 text-sm text-red-600">
                    {t('error_loading_modalities')}
                </div>
            )}
        </div>
    );
}
