// QuoteConfirm.tsx
import React from 'react';

interface QuoteConfirmProps {
    quoteData: any;
    handleNewQuote: () => void;
    handleConfirmQuote: () => void;
}

const QuoteConfirm: React.FC<QuoteConfirmProps> = ({
                                                       quoteData,
                                                       handleNewQuote,
                                                       handleConfirmQuote
                                                   }) => {
    if (!quoteData) return null;

    return (
        <div className="flex flex-col items-center h-[calc(100vh-180px)] overflow-y-auto py-4 px-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="border-b border-gray-200 pb-4 mb-6">
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

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">Moeda:</span>
                            <span className="font-semibold text-right">BRL</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-5 text-xl">Tomador / Borrower</h3>

                        <div className="space-y-5">
                            <div>
                                <div className="text-sm text-gray-500">Nome / Name:</div>
                                <div className="font-medium text-base">{quoteData.borrower.name}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">CNPJ / Tax ID:</div>
                                <div className="font-medium text-base">{quoteData.borrower.taxId}</div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 mt-4">
                                <div className="text-sm text-gray-500">Beneficiário / Beneficiary:</div>
                                <div className="font-medium text-base">{quoteData.beneficiary.name}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">CNPJ / Tax ID:</div>
                                <div className="font-medium text-base">{quoteData.beneficiary.taxId}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
                            Prêmio Total: <span className="text-blue-600">
                R$ {quoteData.premium.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).replace('.', ',')}
              </span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                                onClick={handleNewQuote}
                            >
                                Cancelar
                            </button>

                            <button
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
                                onClick={handleConfirmQuote}
                            >
                                Confirmar Cotação
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteConfirm;
