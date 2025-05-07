//packages/ui/src/ModalitySelectionOriginal.tsx
'use client'

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useAllActiveModalities } from "../../hooks/src/useAllActiveModalities";
import { useTranslation, useLocale } from '@ergo-ai/i18n';

interface ModalitySelectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isDisabled?: boolean;
    preloadedModalities?: any[];
    usePreloadedData?: boolean;
}

function ModalitySelectionOriginal({
                                       value,
                                       onChange,
                                       isDisabled = false,
                                       preloadedModalities = [],
                                       usePreloadedData = false
                                   }: ModalitySelectionProps) {
    const { t } = useTranslation();
    const { locale } = useLocale();

    const { data: hookModalities, isLoading, error } = usePreloadedData
        ? { data: null, isLoading: false, error: null }
        : useAllActiveModalities();

    const filteredModalities = useMemo(() => {
        if (usePreloadedData && preloadedModalities?.length > 0) {
            return preloadedModalities;
        }

        if (!hookModalities) return [];

        return hookModalities.map((modality) => ({
            id: modality.id,
            name: modality.translations.find(
                (translation: { languageCode: string; name: string }) =>
                    translation.languageCode === locale
            )?.name || modality.translations[0].name,
        }));
    }, [hookModalities, locale, preloadedModalities, usePreloadedData]);

    if (isLoading && !usePreloadedData) {
        return (
            <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1">
                    {t("modalidades")}
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 animate-pulse h-12"></div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">
                {t("modalidades")}
            </label>
            <div className="relative">
                <select
                    name="modalidade"
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none ${
                        isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                >
                    <option value="" disabled>
                        {t("select_a_modality")}
                    </option>
                    {filteredModalities.map((modality) => (
                        <option key={modality.id} value={modality.name}>
                            {modality.name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown size={18} />
                </div>
            </div>
        </div>
    );
}

export default ModalitySelectionOriginal;
