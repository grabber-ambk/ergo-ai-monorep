// QuoteResult.tsx
import React from 'react';
import { CheckCircle, Plus, Printer } from 'lucide-react';

interface QuoteResultProps {
    quoteData: any;
    handleNewQuote: () => void;
    handleOpenSignupModal: () => void;
}

const QuoteResult: React.FC<QuoteResultProps> = ({
                                                     quoteData,
                                                     handleNewQuote,
                                                     handleOpenSignupModal
                                                 }) => {
    if (!quoteData) return null;

    return (
        <div className="flex flex-col items-center h-[calc(100vh-180px)] overflow-y-auto py-4 px-4">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Cotação de Seguro Garantia</h1>

                    <div className="flex gap-4">
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={handleNewQuote}
                        >
                            <Plus size={18} />
                            Nova Cotação
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                        >
                            <Printer size={18} />
                            Imprimir Cotação
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <CheckCircle size={24} className="text-green-500" />
                        <h2 className="text-2xl font-bold text-gray-800">Resumo do Pedido</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-700 text-base">Modalidade:</span>
                                <span className="font-semibold text-right">{quoteData.guarantee.type}</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-700 text-base">Cobertura:</span>
                                <span className="font-semibold text-right">{quoteData.guarantee.coverage}</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-700 text-base">Valor Garantia:</span>
                                <span className="font-semibold text-right">
                  R$ {quoteData.guarantee.value.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).replace('.', ',')}
                </span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-700 text-base">Início Vigência:</span>
                                <span className="font-semibold text-right">{quoteData.guarantee.startDate}</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-700 text-base">Final Vigência:</span>
                                <span className="font-semibold text-right">{quoteData.guarantee.endDate}</span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-700 text-base">Dia(s) Cobertura:</span>
                                <span className="font-semibold text-right">{quoteData.guarantee.days}</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="text-gray-700 text-base font-medium">Prêmio Total:</span>
                                <span className="font-bold text-lg text-blue-600">
                  R$ {quoteData.premium.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).replace('.', ',')}
                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-5">Tomador / Borrower</h3>

                            <div className="space-y-5">
                                <div>
                                    <div className="text-sm text-gray-500">Nome / Name:</div>
                                    <div className="font-medium">{quoteData.borrower.name}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500">CNPJ / Tax ID:</div>
                                    <div className="font-medium">{quoteData.borrower.taxId}</div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 mt-4">
                                    <div className="text-sm text-gray-500">Beneficiário / Beneficiary:</div>
                                    <div className="font-medium">{quoteData.beneficiary.name}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500">CNPJ / Tax ID:</div>
                                    <div className="font-medium">{quoteData.beneficiary.taxId}</div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 mt-4">
                                    <div className="text-sm text-gray-500">Objeto da Fiança / Purpose of Guarantee:</div>
                                    <div className="font-medium text-sm mt-1">
                                        {quoteData.guarantee.purpose}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500">Carta fiança Nº / Bail Letter Nº:</div>
                                    <div className="font-medium">{quoteData.guarantee.reference}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <button
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            onClick={handleOpenSignupModal}
                        >
                            Abrir Conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteResult;
