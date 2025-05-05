// apps/web/src/components/QuoteForm.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '@ergo-ai/i18n/src/client';

interface QuoteFormProps {
    quoteData: any;
    onConfirm: () => void;
    onCancel: () => void;
}

interface FormData {
    // Defina as propriedades que seu formData possui
    // Por exemplo:
    [key: string]: string; // Para um objeto genérico de string para string
    // Ou propriedades específicas:
    // name?: string;
    // value?: string;
    // etc...
}

export function QuoteForm({ quoteData, onConfirm, onCancel }: QuoteFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(quoteData);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: FormData) => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{t('summary')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <div className="space-y-5">
                        <div className="flex justify-between">
                            <span className="text-gray-600 text-lg">{t('modality')}:</span>
                            <span className="font-semibold text-lg">{formData.guarantee.type || t('financialGuarantee')}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 text-lg">{t('coverage')}:</span>
                            <span className="font-semibold text-lg">{formData.guarantee.coverage || t('paymentGuarantee')}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 text-lg">{t('guaranteeValue')}:</span>
                            <span className="font-semibold text-lg">{formatCurrency(formData.guarantee.value)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 text-lg">{t('startDate')}:</span>
                            <span className="font-semibold text-lg">{formData.guarantee.startDate}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 text-lg">{t('endDate')}:</span>
                            <span className="font-semibold text-lg">{formData.guarantee.endDate}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 text-lg">{t('days')}:</span>
                            <span className="font-semibold text-lg">{formData.guarantee.days}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 text-lg">{t('currency')}:</span>
                            <span className="font-semibold text-lg">BRL</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-5 text-xl">{t('borrower')}</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="text-sm text-gray-500">Nome / Name:</div>
                            <div className="font-medium text-lg">{formData.borrower.name}</div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500">CNPJ / Tax ID:</div>
                            <div className="font-medium text-lg">{formData.borrower.taxId}</div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 mt-4">
                            <div className="text-sm text-gray-500">Beneficiário / Beneficiary:</div>
                            <div className="font-medium text-lg">{formData.beneficiary.name}</div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500">CNPJ / Tax ID:</div>
                            <div className="font-medium text-lg">{formData.beneficiary.taxId}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="text-2xl font-bold text-gray-800">
                        {t('totalPremium')}: <span className="text-blue-600">{formatCurrency(formData.premium)}</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                            onClick={onCancel}
                        >
                            {t('cancel')}
                        </button>

                        <button
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-200"
                            onClick={onConfirm}
                        >
                            {t('confirmButton')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
