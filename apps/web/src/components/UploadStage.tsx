// UploadStage.tsx
import React from 'react';
import { Calendar, ChevronDown, Upload } from 'lucide-react';

interface UploadStageProps {
    activeTab: string;
    handleTabChange: (tab: string) => void;
    fileUploaded: boolean;
    uploadedFilename: string;
    fileSize: string;
    advancedFormData: any;
    handleAdvancedFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleFileSelected: (e: any) => void;
    handleGenerateQuote: () => void;
    handleGenerateAdvancedQuote: () => void;
}

const UploadStage: React.FC<UploadStageProps> = ({
                                                     activeTab,
                                                     handleTabChange,
                                                     fileUploaded,
                                                     uploadedFilename,
                                                     fileSize,
                                                     advancedFormData,
                                                     handleAdvancedFormChange,
                                                     handleFileSelected,
                                                     handleGenerateQuote,
                                                     handleGenerateAdvancedQuote
                                                 }) => {
    // Tabbed interface component
    const TabbedInterface = () => (
        <div className="mb-6">
            <div className="flex border-b border-gray-200">
                <button
                    className={`px-6 py-3 font-medium text-base ${activeTab === 'simple'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('simple')}
                >
                    SIMPLES
                </button>
                <button
                    className={`px-6 py-3 font-medium text-base ${activeTab === 'advanced'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('advanced')}
                >
                    AVANÇADO
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center h-full px-6 py-8">
            <TabbedInterface />

            {activeTab === 'simple' ? (
                // Simple tab content
                <div className="w-full flex flex-col items-center">
                    {!fileUploaded ? (
                        // Empty upload state
                        <div
                            className="w-full max-w-xl h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 transition-colors hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                            onClick={() => document.getElementById('file-input')?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFileSelected(e);
                            }}
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                <Upload size={20} className="text-blue-500" />
                            </div>
                            <p className="text-gray-600 text-center mb-2">
                                Arraste e solte seu arquivo aqui ou <span className="text-blue-500 font-medium">browse</span>
                            </p>
                            <p className="text-sm text-gray-500">.PDF (max. 10MB)</p>
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileSelected}
                            />
                        </div>
                    ) : (
                        // File uploaded state
                        <div className="w-full max-w-xl border border-gray-200 rounded-lg p-8 flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-gray-800 font-medium text-xl mb-1">{uploadedFilename}</p>
                            <p className="text-gray-500 mb-6">{fileSize}</p>
                        </div>
                    )}

                    <button
                        id="generateButton"
                        className={`mt-8 px-6 py-3 rounded-lg font-medium text-base transition-all 
            ${fileUploaded
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        disabled={!fileUploaded}
                        onClick={handleGenerateQuote}
                    >
                        Gerar Cotação
                    </button>
                </div>
            ) : (
                // Advanced tab content
                <div className="w-full max-w-4xl">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-5">Basic information</h3>

                        <div className="space-y-4">
                            {/* Modalidades dropdown */}
                            <div className="w-full">
                                <select
                                    name="modalidade"
                                    value={advancedFormData.modalidade}
                                    onChange={handleAdvancedFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="" disabled>Modalidades</option>
                                    <option value="financeira">Garantia Financeira</option>
                                    <option value="performance">Garantia de Performance</option>
                                    <option value="judicial">Garantia Judicial</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Start date */}
                                <div className="relative">
                                    <label className="block text-sm text-gray-500 mb-1">Start date</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="startDate"
                                            value={advancedFormData.startDate}
                                            onChange={handleAdvancedFormChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Calendar size={18} />
                                        </div>
                                    </div>
                                </div>

                                {/* Days amount */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Days amount</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="days"
                                            value={advancedFormData.days}
                                            onChange={handleAdvancedFormChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col text-gray-400">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
                                                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* End date */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">End date</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="endDate"
                                            value={advancedFormData.endDate}
                                            onChange={handleAdvancedFormChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Calendar size={18} />
                                        </div>
                                    </div>
                                </div>

                                {/* Guarantee Value */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Guarantee Value</label>
                                    <input
                                        type="text"
                                        name="guaranteeValue"
                                        value={advancedFormData.guaranteeValue}
                                        onChange={handleAdvancedFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {/* Currency */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Currency</label>
                                    <div className="relative">
                                        <select
                                            name="currency"
                                            value={advancedFormData.currency}
                                            onChange={handleAdvancedFormChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                                        >
                                            <option value="BRL">BRL</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>

                                {/* Comissão Corretor ($) */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Comissão Corretor ($)</label>
                                    <input
                                        type="text"
                                        name="comissaoCorretorValue"
                                        value={advancedFormData.comissaoCorretorValue}
                                        onChange={handleAdvancedFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Comissão Corretor (%) */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Comissão Corretor (%)</label>
                                    <input
                                        type="text"
                                        name="comissaoCorretorPercentage"
                                        value={advancedFormData.comissaoCorretorPercentage}
                                        onChange={handleAdvancedFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Comissão Agravada */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Comissão Agravada</label>
                                    <input
                                        type="text"
                                        name="comissaoAgravada"
                                        value={advancedFormData.comissaoAgravada}
                                        onChange={handleAdvancedFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Taxa */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Taxa</label>
                                    <input
                                        type="text"
                                        name="taxa"
                                        value={advancedFormData.taxa}
                                        onChange={handleAdvancedFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50">
                                    Analise Contrato I.A
                                </button>
                                <button className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                                    Definir Layout
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <button className="px-6 py-3 text-red-500 hover:text-red-600">
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={handleGenerateAdvancedQuote}
                                >
                                    Gerar Proposta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadStage;
