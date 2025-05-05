'use client'

import React from 'react';
import { Upload } from 'lucide-react';
import AdvancedTabUpdated from './AdvancedTabUpdated';
import { useTranslation } from "@ergo-ai/i18n/src/client";

interface UploadStageProps {
    activeTab: string;
    handleTabChange: (tab: string) => void;
    fileUploaded: boolean;
    uploadedFilename: string;
    fileSize: string;
    advancedFormData: {
        modalidade: string;
        startDate: string;
        endDate: string;
        days: string;
        guaranteeValue: string;
        currency: string;
        comissaoCorretorValue: string;
        comissaoCorretorPercentage: string;
        comissaoAgravada: string;
        taxa: string;
    };
    handleAdvancedFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGenerateQuote: () => void;
    handleGenerateAdvancedQuote: () => void;
}

// Valores padrão
const defaultAdvancedFormData = {
    modalidade: 'financeira',
    startDate: '29/04/2025',
    endDate: '29/04/2026',
    days: '365',
    guaranteeValue: 'R$ 2.000,00',
    currency: 'BRL',
    comissaoCorretorValue: 'R$ 0,00',
    comissaoCorretorPercentage: '20,00%',
    comissaoAgravada: 'R$ 0,00',
    taxa: '5,00%'
};

const UploadStageUpdated: React.FC<UploadStageProps> = ({
                                                            activeTab,
                                                            handleTabChange,
                                                            fileUploaded,
                                                            uploadedFilename,
                                                            fileSize,
                                                            advancedFormData = defaultAdvancedFormData, // Valores padrão para evitar undefined
                                                            handleAdvancedFormChange,
                                                            handleFileSelected,
                                                            handleGenerateQuote,
                                                            handleGenerateAdvancedQuote,
                                                        }) => {
    const { t } = useTranslation(); // Hook de tradução

    // Mapeamento de textos para internacionalização
    const i18n = {
        simples: "SIMPLES",
        avancado: "AVANÇADO",
        arrasteESolte: "Arraste e solte seu arquivo aqui ou",
        browse: "browse",
        pdfMaxSize: ".PDF (max. 10MB)",
        gerarCotacao: "Gerar Cotação"
    };

    return (
        <div className="h-full overflow-auto">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`py-4 px-6 font-medium text-sm ${
                        activeTab === 'simple'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange('simple')}
                >
                    {i18n.simples}
                </button>
                <button
                    className={`py-4 px-6 font-medium text-sm ${
                        activeTab === 'advanced'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange('advanced')}
                >
                    {i18n.avancado}
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'simple' ? (
                    /* Simple tab - File upload */
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
                        <div className="w-full max-w-md">
                            {fileUploaded ? (
                                /* Arquivo carregado */
                                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                                    <div className="flex items-center mb-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{uploadedFilename}</div>
                                            <div className="text-xs text-gray-500">{fileSize}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerateQuote}
                                        className="w-full bg-blue-600 text-white rounded-lg py-2.5 px-4 hover:bg-blue-700 transition-colors"
                                    >
                                        {i18n.gerarCotacao}
                                    </button>
                                </div>
                            ) : (
                                /* Área de upload */
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
                                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                                        <Upload size={24} />
                                    </div>
                                    <p className="mb-2 text-sm text-gray-700">{i18n.arrasteESolte}</p>
                                    <label className="inline-block cursor-pointer text-blue-600 hover:text-blue-800">
                                        <span className="text-sm">{i18n.browse}</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileSelected}
                                        />
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">{i18n.pdfMaxSize}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Advanced tab */
                    <AdvancedTabUpdated
                        formData={advancedFormData}
                        onChange={handleAdvancedFormChange}
                        onGenerateQuote={handleGenerateAdvancedQuote}
                    />
                )}
            </div>
        </div>
    );
};

export default UploadStageUpdated;
