// packages/ui/src/client/ModalitySelectorClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@ergo-ai/i18n';

interface ModalitySelectorClientProps {
    initialModalities: {
        id: string;
        name: string;
    }[];
    defaultValue?: string;
    onChange?: (value: string) => void;
}

export function ModalitySelectorClient({
                                           initialModalities,
                                           defaultValue = '',
                                           onChange
                                       }: ModalitySelectorClientProps) {
    const { t } = useTranslation();
    const [value, setValue] = useState(defaultValue);
    // Adicionamos um estado para controlar se o componente está no cliente
    const [isClient, setIsClient] = useState(false);

    // Efeito para marcar quando o componente está no cliente
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">
                {t("modalidades")}
            </label>
            <div className="relative">
                <select
                    name="modalidade"
                    value={value}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                >
                    <option value="" disabled>
                        {t("select_a_modality")}
                    </option>
                    {initialModalities.map((modality) => (
                        <option key={modality.id} value={modality.name}>
                            {modality.name}
                        </option>
                    ))}
                </select>
                {/* Renderizar o ícone apenas do lado do cliente */}
                {isClient && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={18} />
                    </div>
                )}
            </div>
        </div>
    );
}
