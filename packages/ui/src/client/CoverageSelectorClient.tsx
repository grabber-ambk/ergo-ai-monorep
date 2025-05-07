// packages/ui/src/client/CoverageSelectorClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@ergo-ai/i18n';

interface CoverageSelectorClientProps {
    initialCoverages: {
        id: string;
        name: string;
    }[];
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isDisabled?: boolean;
}

export function CoverageSelectorClient({
                                           initialCoverages = [],
                                           defaultValue = '',
                                           onChange,
                                           isDisabled = false
                                       }: CoverageSelectorClientProps) {
    const { t } = useTranslation();
    const [value, setValue] = useState(defaultValue);
    const [isClient, setIsClient] = useState(false);

    // Marcar quando estamos no cliente
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">
                {t('coberturas', 'Coberturas')}
            </label>
            <div className="relative">
                <select
                    name="cobertura"
                    value={value}
                    onChange={handleChange}
                    disabled={isDisabled || !initialCoverages.length}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none ${
                        isDisabled || !initialCoverages.length ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                >
                    <option value="" disabled>
                        {!initialCoverages.length
                            ? t('select_a_modality_first', 'Selecione uma modalidade primeiro')
                            : t('select_a_coverage', 'Selecione uma cobertura')}
                    </option>
                    {initialCoverages.map((coverage) => (
                        <option key={coverage.id} value={coverage.name}>
                            {coverage.name}
                        </option>
                    ))}
                </select>
                {isClient && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={18} />
                    </div>
                )}
            </div>
        </div>
    );
}
