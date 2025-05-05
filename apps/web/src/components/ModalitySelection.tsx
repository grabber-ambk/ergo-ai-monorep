// components/ModalitySelection.tsx
"use client";

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useAllActiveModalities } from "@ergo-ai/hooks/src/useAllActiveModalities";
import { useTranslation, useLocale } from '@ergo-ai/i18n';

interface ModalitySelectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isDisabled?: boolean;
}

function ModalitySelection({
  value,
  onChange,
  isDisabled = false,
}: ModalitySelectionProps) {
    const { t } = useTranslation();
    const { locale } = useLocale();

  const { data: modalities, isLoading, error } = useAllActiveModalities();

  const filteredModalities = useMemo(() => {
      if (!modalities) return [];

      return modalities.map((modality) => ({
          id: modality.id,
          name:
              modality.translations.find(
                  (translation: { languageCode: string; name: string }) => translation.languageCode === locale
              )?.name || modality.translations[0].name,
      }));
  }, [modalities, locale]);

  if (isLoading) {
    return (
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">
          {t("modalidades")}
        </label>
        <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 animate-pulse h-12"></div>
      </div>
    );
  }

//   if (error) {
//     console.log("Usando dados estáticos devido a erro na API:", error);

//     const staticModalities = [
//       { id: "financeira", name: "GARANTIA FINANCEIRA", value: "financeira" },
//       {
//         id: "performance",
//         name: "GARANTIA DE PERFORMANCE",
//         value: "performance",
//       },
//       { id: "judicial", name: "GARANTIA JUDICIAL", value: "judicial" },
//     ];

//     return (
//       <div className="mb-4">
//         <label className="block text-sm text-gray-500 mb-1">
//           {t("modalidades")}
//         </label>
//         <div className="relative">
//           <select
//             name="modalidade"
//             value={value} // Valor é o ID da modalidade selecionada
//             onChange={onChange}
//             data-name={
//               filteredModalities.find((m) => m.id === value)?.name || ""
//             }
//           >
//             {filteredModalities.map((modality) => (
//               <option
//                 key={modality.id}
//                 value={modality.name}
//                 data-name={modality.name}
//               >
//                 {modality.name}
//               </option>
//             ))}
//           </select>
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
//             <ChevronDown size={18} />
//           </div>
//         </div>
//       </div>
//     );
//   }

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

export default ModalitySelection;
