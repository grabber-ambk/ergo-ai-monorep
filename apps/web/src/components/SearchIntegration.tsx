'use client'

import React, { useState } from 'react';
import SearchResults from './SearchResults';

// Interface para o resultado da busca (a mesma do componente SearchResults)
interface SearchResult {
    id: string;
    tomador: string;
    beneficiario: string;
    modalidade: string;
    cobertura: string;
    dataInicio: string;
    dataFim: string;
    valorGarantia: string;
    taxa: string;
    valorComissao: string;
    premio: string;
    premioTotal: string;
    status: string;
}

interface SearchIntegrationProps {
    onSelectQuote?: (quoteData: any) => void;
}

const SearchIntegration: React.FC<SearchIntegrationProps> = ({ onSelectQuote }) => {
    const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

    // Trata a seleção de um resultado da busca
    const handleSelectResult = (result: SearchResult) => {
        setSelectedResult(result);

        // Transformar o resultado da busca em dado de cotação (formato semelhante ao mockQuoteData existente)
        if (onSelectQuote) {
            const quoteData = {
                borrower: {
                    name: result.tomador,
                    taxId: "00.000.000/0001-00", // Simulado
                    address: "ENDEREÇO SIMULADO, 123",
                    zipCode: "00000-000",
                    city: "SÃO PAULO",
                    state: "SP",
                    email: "contato@empresa.com"
                },
                beneficiary: {
                    name: result.beneficiario,
                    taxId: "00.000.000/0001-00", // Simulado
                    address: "ENDEREÇO SIMULADO, 456",
                    zipCode: "00000-000",
                    city: "SÃO PAULO",
                    state: "SP"
                },
                guarantee: {
                    type: result.modalidade,
                    coverage: result.cobertura,
                    value: parseFloat(result.valorGarantia.replace(/[^0-9,]/g, '').replace(',', '.')),
                    startDate: result.dataInicio,
                    endDate: result.dataFim,
                    days: 365, // Simulado
                    reference: `REF${result.id}${Date.now().toString().slice(-6)}`,
                    proposal: `PROP${result.id}${Date.now().toString().slice(-6)}`,
                    purpose: "Garantia gerada pelo sistema de busca. Propósito simulado para demonstração."
                },
                premium: parseFloat(result.premio.replace(/[^0-9.]/g, ''))
            };

            onSelectQuote(quoteData);
        }
    };

    return (
        <div className="w-full">
            <SearchResults onSelectResult={handleSelectResult} />
        </div>
    );
};

export default SearchIntegration;
