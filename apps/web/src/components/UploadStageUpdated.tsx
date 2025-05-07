'use client'

import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import AdvancedTabUpdated from './AdvancedTabUpdated';
import { useTranslation } from "@ergo-ai/i18n/src/client";
import {ClientOnlyIcon} from "@ergo-ai/ui";

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
                                                            advancedFormData = defaultAdvancedFormData,
                                                            handleAdvancedFormChange,
                                                            handleFileSelected,
                                                            handleGenerateQuote,
                                                            handleGenerateAdvancedQuote,
                                                        }) => {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manipuladores para o drag and drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Criar um evento sintético para passar ao manipulador existente
            const fileList = e.dataTransfer.files;
            const event = {
                target: {
                    files: fileList
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            handleFileSelected(event);
        }
    };

    // Função para acionar o input de arquivo via botão
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
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
                    {t('simple')}
                </button>
                <button
                    className={`py-4 px-6 font-medium text-sm ${
                        activeTab === 'advanced'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange('advanced')}
                >
                    {t('advanced')}
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'simple' ? (
                    /* Simple tab - File upload */
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold mb-2">{t('upload_contract_title')}</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">{t('upload_contract_description')}</p>
                        </div>

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
                                        {t('generate_quote')}
                                    </button>
                                </div>
                            ) : (
                                /* Área de upload com drag and drop */
                                <div
                                    className={`border-2 ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300 bg-white'} rounded-lg p-12 text-center transition-colors`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                                        <ClientOnlyIcon>
                                            <Upload size={24} />
                                        </ClientOnlyIcon>
                                    </div>
                                    <p className="mb-2 text-sm text-gray-700">{t('drag_drop_contract')}</p>
                                    <button
                                        onClick={triggerFileInput}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        {t('browse')}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelected}
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">{t('pdf_max_size')}</p>
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
