// PreviousQuotes.tsx
import React from 'react';
import { useTranslation } from '@ergo-ai/i18n/src/client';

interface Quote {
    id: string;
    company: string;
    date: string;
    value: number;
}

interface PreviousQuotesProps {
    quotes: Quote[];
    onSelectQuote: (quoteId: string) => void;
}

const PreviousQuotes: React.FC<PreviousQuotesProps> = ({ quotes, onSelectQuote }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            {quotes.map((quote) => (
                <div
                    key={quote.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => onSelectQuote(quote.id)}
                >
                    <div className="font-medium">{quote.company}</div>
                    <div className="text-xs text-gray-500 mt-1">{quote.date}</div>
                    <div className="text-blue-600 font-medium mt-1">
                        R$ {quote.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')}
                    </div>
                </div>
            ))}

            {quotes.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    {t('no_quotes_found')}
                </div>
            )}
        </div>
    );
};

export default PreviousQuotes;
