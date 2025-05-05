import { useState } from 'react';
import { useDateCalculations } from '../date/useDateCalculations';

export const useAdvancedForm = (initialValues = {}) => {
    const { today, defaultDays, defaultEndDate, calculateEndDate } = useDateCalculations();

    // Estado inicial mesclado com os defaults
    const defaultFormData = {
        modalidade: '',
        startDate: today,
        endDate: defaultEndDate,
        days: defaultDays.toString(),
        guaranteeValue: 'R$ 0,00',
        currency: 'BRL',
        comissaoCorretorValue: 'R$ 0,00',
        comissaoCorretorPercentage: '20,00%',
        comissaoAgravada: 'R$ 0,00',
        taxa: '5,00%'
    };

    const [formData, setFormData] = useState({ ...defaultFormData, ...initialValues });

    // Handler para mudanças no formulário
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        // Log para debug
        console.log('Formulário recebeu alteração:', name, value);

        // Verificar se o nome do campo está definido
        if (!name) {
            console.error('Campo sem nome definido:', e);
            return; // Não processar eventos sem nome de campo
        }

        // Caso especial para campos que precisam atualizar outros campos
        if (name === 'startDate') {
            // Quando a data inicial é alterada, recalcular a data final
            const newEndDate = calculateEndDate(value, parseInt(formData.days, 10));
            setFormData(prev => ({
                ...prev,
                [name]: value,
                endDate: newEndDate
            }));
        }
        else if (name === 'days') {
            // Quando os dias são alterados, recalcular a data final
            const days = parseInt(value, 10) || 0;
            const newEndDate = calculateEndDate(formData.startDate, days);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                endDate: newEndDate
            }));
        }
        else if (name === 'endDate') {
            // Quando a data final é alterada, recalcular os dias
            try {
                const [startDay, startMonth, startYear] = formData.startDate.split('/').map(Number);
                const [endDay, endMonth, endYear] = value.split('/').map(Number);

                const startDate = new Date(startYear, startMonth - 1, startDay);
                const endDate = new Date(endYear, endMonth - 1, endDay);

                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    days: diffDays.toString()
                }));
            } catch (error) {
                console.error('Erro ao calcular a diferença de dias:', error);
                // Apenas atualiza a data final sem recalcular os dias em caso de erro
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
        else if (name === 'currency') {
            // Quando a moeda mudar, precisamos reformatar o valor de garantia
            const newCurrency = value;
            const currentValue = formData.guaranteeValue;

            // Extrair o valor numérico da string formatada atual
            // Remover todos os caracteres não numéricos exceto ponto e vírgula
            let numericString = currentValue.replace(/[^\d,.]/g, '');

            // Adaptar o parsing com base na moeda atual
            const currentCurrency = formData.currency;
            let numericValue;

            if (currentCurrency === 'BRL' || currentCurrency === 'EUR') {
                // Para formatos com vírgula como separador decimal
                numericValue = parseFloat(numericString.replace(/\./g, '').replace(',', '.'));
            } else {
                // Para formatos com ponto como separador decimal
                numericValue = parseFloat(numericString.replace(/,/g, ''));
            }

            if (isNaN(numericValue)) numericValue = 0;

            // Configurações para cada moeda
            const currencySettings = {
                'BRL': { symbol: 'R$ ', locale: 'pt-BR', decimalSeparator: ',', thousandSeparator: '.' },
                'USD': { symbol: '$ ', locale: 'en-US', decimalSeparator: '.', thousandSeparator: ',' },
                'EUR': { symbol: '€ ', locale: 'de-DE', decimalSeparator: ',', thousandSeparator: '.' },
                'GBP': { symbol: '£ ', locale: 'en-GB', decimalSeparator: '.', thousandSeparator: ',' }
            };

            // Obter as configurações da nova moeda
            const settings = currencySettings[newCurrency as keyof typeof currencySettings] || currencySettings['BRL'];

            // Formatar o valor para a nova moeda
            const formattedValue = settings.symbol + numericValue.toLocaleString(settings.locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Atualizar o estado com a nova moeda e o valor reformatado
            setFormData(prev => ({
                ...prev,
                currency: newCurrency,
                guaranteeValue: formattedValue
            }));
        }
        else if (name === 'guaranteeValue') {
            // Tratamento especial para o valor de garantia
            try {
                // Obter a moeda atual
                const currentCurrency = formData.currency;

                // Configurações para cada moeda
                const currencySettings = {
                    'BRL': { symbol: 'R$ ', locale: 'pt-BR', decimalSeparator: ',', thousandSeparator: '.' },
                    'USD': { symbol: '$ ', locale: 'en-US', decimalSeparator: '.', thousandSeparator: ',' },
                    'EUR': { symbol: '€ ', locale: 'de-DE', decimalSeparator: ',', thousandSeparator: '.' },
                    'GBP': { symbol: '£ ', locale: 'en-GB', decimalSeparator: '.', thousandSeparator: ',' }
                };

                // Usar as configurações da moeda atual ou padrão para BRL
                const settings = currencySettings[currentCurrency as keyof typeof currencySettings] || currencySettings['BRL'];

                // Verificar se temos um valor formatado completo
                if (value.includes(settings.symbol)) {
                    // Já está formatado como moeda, aceitar como está
                    setFormData(prev => ({
                        ...prev,
                        guaranteeValue: value
                    }));
                    console.log('Valor já formatado aceito:', value);
                    return;
                }

                // Remover qualquer símbolo de moeda e espaços
                let cleanValue = value.replace(/[^\d,.]/g, '');

                // Se vazio, definir como zero
                if (!cleanValue) cleanValue = '0';

                // Adaptar o valor para o formato numérico correto com base na moeda
                let numericValue;

                if (settings.decimalSeparator === ',') {
                    // Para formatos europeus/brasileiros (1.234,56)
                    numericValue = cleanValue.replace(/\./g, '').replace(',', '.');
                } else {
                    // Para formatos americanos/britânicos (1,234.56)
                    numericValue = cleanValue.replace(/,/g, '');
                }

                // Se for vazio ou não numérico, definir como zero
                if (!numericValue || isNaN(parseFloat(numericValue))) {
                    numericValue = '0';
                }

                // Converter para número
                const amount = parseFloat(numericValue);

                // Formatar o valor de acordo com o locale da moeda
                const formattedValue = settings.symbol + amount.toLocaleString(settings.locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                console.log('Valor formatado para moeda:', currentCurrency, formattedValue);

                setFormData(prev => ({
                    ...prev,
                    guaranteeValue: formattedValue
                }));
            } catch (error) {
                console.error('Erro ao formatar valor de garantia:', error);
                // Em caso de erro, manter o valor atual
                setFormData(prev => ({
                    ...prev
                }));
            }
        }
        else {
            // Caso padrão: atualizar o campo normalmente
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        console.log('Estado do formulário atualizado:', name, value);
    };

    // Handler específico para mudança de modalidade
    const handleModalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Este evento será passado para o onChange nas props
        handleFormChange(e);

        // Também atualiza o estado local para refletir a mudança imediatamente
        const newValue = e.target.value;
        console.log("modalidade => ", newValue);

        setFormData(prev => ({
            ...prev,
            modalidade: newValue,
            // Resetar a cobertura quando a modalidade mudar
            cobertura: ""
        }));
    };

    // Handler específico para mudança de cobertura
    const handleCoverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleFormChange(e);

        const newValue = e.target.value;
        console.log("cobertura => ", newValue);

        setFormData(prev => ({
            ...prev,
            cobertura: newValue
        }));
    };

    return {
        formData,
        setFormData,
        handleFormChange,
        handleModalityChange,
        handleCoverageChange
    };
};

export default useAdvancedForm;
