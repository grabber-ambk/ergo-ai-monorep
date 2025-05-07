// packages/ui/src/integrations/ModalidadeCoberturaIntegration.tsx
'use client'

import { useModalityCoverages } from '@ergo-ai/hooks/src/modality/useModalityCoverages';
import { Modality } from '@ergo-ai/hooks/src/types';
import ModalitySelectionWrapper from '../wrappers/ModalitySelectionWrapper';
import { CoverageSelectorClient } from "../client/CoverageSelectorClient";

interface ModalidadeCoberturaIntegrationProps {
    initialModalities: Modality[];
}

export default function ModalidadeCoberturaIntegration({
                                                           initialModalities
                                                       }: ModalidadeCoberturaIntegrationProps) {
    const {
        selectedModality,
        coverages,
        isLoading,
        handleModalityChange
    } = useModalityCoverages(initialModalities, {
        onError: (error) => {
            // Opcional: adicionar tratamento de erro específico para o componente
            console.error('Erro ao carregar coberturas:', error.message);
        }
    });

    return (
        <div>
            <div className="mb-6">
                <ModalitySelectionWrapper
                    value={selectedModality}
                    onChange={handleModalityChange}
                    initialModalities={initialModalities}
                />
            </div>

            <div>
                <CoverageSelectorClient
                    initialCoverages={coverages}
                    isDisabled={!selectedModality || isLoading}
                />
            </div>
        </div>
    );
}
