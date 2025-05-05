'use client'

import '../app/globals.css';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from "@ergo-ai/i18n/src/client";

// Tipos para os resultados de busca
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

// Dados falsos para demonstração
const fakeDemoResults: SearchResult[] = [
    {
        id: '1',
        tomador: 'ERGO ASSURANCE S.A.',
        beneficiario: 'NEOSAT TELECOMUNICACOES LTDA',
        modalidade: 'GARANTIA JUDICIAL',
        cobertura: 'DEPÓSITO JUDICIAL TRABALHISTA',
        dataInicio: '10/21/2024',
        dataFim: '10/21/2025',
        valorGarantia: 'R$ 6.789.123,00',
        taxa: '5,00%',
        valorComissao: '$ 0.00',
        premio: '$ 67891.23',
        premioTotal: '$ 339456.1500',
        status: 'Guarantees'
    },
    {
        id: '2',
        tomador: 'KEYSTONE GESTÃO IMOBILIARIA LTDA',
        beneficiario: 'METAH LTDA',
        modalidade: 'GARANTIA IMOBILIARIA',
        cobertura: 'PRIVADA',
        dataInicio: '10/25/2024',
        dataFim: '10/25/2025',
        valorGarantia: 'R$ 540.000,00',
        taxa: '6,48%',
        valorComissao: 'R$ 0.00',
        premio: 'R$ 6998.40',
        premioTotal: 'R$ 34992.0000',
        status: 'Guarantees'
    },
    {
        id: '3',
        tomador: 'JHONATHAN FLAVIO COUTO DOS SANTOS 51482518830',
        beneficiario: 'PRO ENGENHARIA LTDA',
        modalidade: 'SKR - SAFE KEEP RECEIPT',
        cobertura: 'INTERNACIONAL',
        dataInicio: '11/27/2024',
        dataFim: '11/27/2025',
        valorGarantia: 'R$ 2.345.678,00',
        taxa: '5,00%',
        valorComissao: 'R$ 0.00',
        premio: 'R$ 23456.78',
        premioTotal: 'R$ 117283.9000',
        status: 'Guarantees'
    }
];

interface SearchResultsProps {
    onSelectResult?: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ onSelectResult }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);

    // Simula uma busca com base no termo digitado
    useEffect(() => {
        if (searchTerm.length > 2) {
            // Simulando uma busca nos dados fake
            const results = fakeDemoResults.filter(
                result =>
                    result.tomador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    result.beneficiario.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchTerm]);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectResult = (result: SearchResult) => {
        if (onSelectResult) {
            onSelectResult(result);
        }
        setShowResults(false);
    };

    return (
        <div className="relative">
            {/* Campo de busca */}
            <div className="relative flex-grow max-w-xl mx-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchInput}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Buscar Cotações de Garantias"
                    />
                </div>
            </div>

            {/* Grid de resultados */}
            {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 max-h-[500px] overflow-y-auto">
                    <div className="p-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tomador
                                </th>
                                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Beneficiário
                                </th>
                                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Modalidade
                                </th>
                                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Garantia
                                </th>
                                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {searchResults.map((result) => (
                                <tr
                                    key={result.id}
                                    onClick={() => handleSelectResult(result)}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {result.tomador}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {result.beneficiario}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {result.modalidade}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {result.valorGarantia}
                                    </td>
                                    <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {result.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
