// QuoteConfirm.tsx
import React from 'react';
import { useTranslation } from '@ergo-ai/i18n/src/client';

interface CompanyInfo {
    name: string;
    address: string;
    registerNumber: string;
    logoUrl: string;
}

interface QuoteDataExtended {
    guarantee: {
        type: string;
        coverage: string;
        value: number;
        startDate: string;
        endDate: string;
        days: number;
    };
    borrower: {
        name: string;
        taxId: string;
    };
    beneficiary: {
        name: string;
        taxId: string;
    };
    premium: number;
    purposeOfGuarantee?: string;
    bailLetterNo?: string;
    reference?: string;
    company?: CompanyInfo;
}

interface QuoteConfirmProps {
    quoteData: QuoteDataExtended;
    handleNewQuote: () => void;
    handleConfirmQuote: () => void;
}

const QuoteConfirm: React.FC<QuoteConfirmProps> = ({
                                                       quoteData,
                                                       handleNewQuote,
                                                       handleConfirmQuote
                                                   }) => {
    const { t } = useTranslation();

    if (!quoteData) return null;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace('.', ',');
    };

    return (
        <div className="flex flex-col items-center h-[calc(100vh-180px)] overflow-y-auto py-4 px-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                {/* Company Header with Logo */}
                {quoteData.company && (
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                {quoteData.company.logoUrl && (
                                    <img
                                        src={quoteData.company.logoUrl}
                                        alt={quoteData.company.name}
                                        className="h-14 mr-4"
                                    />
                                )}
                                <div>
                                    <h2 className="font-bold text-gray-800">{quoteData.company.name}</h2>
                                    <p className="text-sm text-gray-600">{quoteData.company.address}</p>
                                    <p className="text-sm text-gray-600">{t('company_register')} № {quoteData.company.registerNumber}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h1 className="text-2xl font-bold text-gray-800">{t('proposal')}</h1>
                                {quoteData.reference && (
                                    <p className="text-sm text-gray-500">#{quoteData.reference}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Summary Title */}
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{t('order_summary')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">{t('modality')}:</span>
                            <span className="font-semibold text-right">{quoteData.guarantee.type}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">{t('coverage')}:</span>
                            <span className="font-semibold text-right">{quoteData.guarantee.coverage}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">{t('guarantee_value')}:</span>
                            <span className="font-semibold text-right">
                                R$ {formatCurrency(quoteData.guarantee.value)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">{t('start_date')}:</span>
                            <span className="font-semibold text-right">{quoteData.guarantee.startDate}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">{t('end_date')}:</span>
                            <span className="font-semibold text-right">{quoteData.guarantee.endDate}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">{t('coverage_days')}:</span>
                            <span className="font-semibold text-right">{quoteData.guarantee.days}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-base">{t('currency')}:</span>
                            <span className="font-semibold text-right">BRL</span>
                        </div>

                        {quoteData.bailLetterNo && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-700 text-base">{t('bail_letter_no')}:</span>
                                <span className="font-semibold text-right">{quoteData.bailLetterNo}</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-5 text-xl">{t('borrower')}</h3>

                        <div className="space-y-5">
                            <div>
                                <div className="text-sm text-gray-500">{t('name')}:</div>
                                <div className="font-medium text-base">{quoteData.borrower.name}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">{t('tax_id')}:</div>
                                <div className="font-medium text-base">{quoteData.borrower.taxId}</div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 mt-4">
                                <div className="text-sm text-gray-500">{t('beneficiary')}:</div>
                                <div className="font-medium text-base">{quoteData.beneficiary.name}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">{t('tax_id')}:</div>
                                <div className="font-medium text-base">{quoteData.beneficiary.taxId}</div>
                            </div>

                            {quoteData.purposeOfGuarantee && (
                                <div className="pt-4 border-t border-gray-200 mt-4">
                                    <div className="text-sm text-gray-500">{t('purpose_of_guarantee')}:</div>
                                    <div className="font-medium text-base">{quoteData.purposeOfGuarantee}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
                            {t('total_premium')}: <span className="text-blue-600">
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
                                {t('cancel')}
                            </button>

                            <button
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
                                onClick={handleConfirmQuote}
                            >
                                {t('confirm_quote')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteConfirm;
