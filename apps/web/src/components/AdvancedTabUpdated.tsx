'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from "@ergo-ai/i18n/src/client";
import ModalitySelection from "@/components/ModalitySelection";
import CoverageSelection from "@/components/CoverageSelection";
import DatePicker from "@/components/DatePicker";

interface AdvancedTabProps {
  formData: {
    modalidade: string;
    cobertura?: string;
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onGenerateQuote: () => void;
}

// Valores padrão para o caso de formData ser undefined
const defaultFormData = {
  modalidade: "",
  cobertura: "",
  startDate: "29/04/2025",
  endDate: "29/04/2026",
  days: "365",
  guaranteeValue: "R$ 2.000,00",
  currency: "BRL",
  comissaoCorretorValue: "R$ 0,00",
  comissaoCorretorPercentage: "20,00%",
  comissaoAgravada: "R$ 0,00",
  taxa: "5,00%"
};

const AdvancedTabUpdated: React.FC<AdvancedTabProps> = ({
                                                          formData = defaultFormData,
                                                          onChange,
                                                          onGenerateQuote
                                                        }) => {
  const { t } = useTranslation(); // Hook de tradução
  const [showSummary, setShowSummary] = useState(false);
  const [localFormData, setLocalFormData] = useState(formData);

  // Mostrar resumo automaticamente assim que qualquer campo for interagido
  useEffect(() => {
    // Se algum campo tiver valor, mostrar o resumo
    if (formData.modalidade || formData.guaranteeValue !== "R$ 0,00") {
      setShowSummary(true);
    }

    // Atualizar dados locais quando props mudarem, MAS PRESERVAR modalidade e cobertura
    setLocalFormData(prev => ({
      ...formData,
      // Preservar valores de modalidade e cobertura se já estiverem definidos
      modalidade: prev.modalidade || formData.modalidade,
      cobertura: prev.cobertura || formData.cobertura
    }));

    console.log('formData atualizado:', formData);
  }, [formData]);

  // Sempre mostrar o resumo quando algum campo do formulário é modificado
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('Campo alterado:', e.target.name, e.target.value);

    if (onChange) {
      onChange(e);
    }

    // Atualizar também o estado local imediatamente
    setLocalFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setShowSummary(true);
  };

  // Calcular o número de dias entre duas datas
  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "0";

    try {
      // Parse das datas no formato dd/MM/yyyy
      const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
      const [endDay, endMonth, endYear] = endDate.split('/').map(Number);

      const start = new Date(startYear, startMonth - 1, startDay);
      const end = new Date(endYear, endMonth - 1, endDay);

      // Calcular a diferença em dias
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays.toString();
    } catch (error) {
      console.error('Erro ao calcular dias:', error);
      return "0";
    }
  };

  // Handler para mudança de data inicial
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    handleFormChange(e);

    // Atualizar o número de dias se a data final existir
    if (localFormData.endDate) {
      const days = calculateDays(newStartDate, localFormData.endDate);
      const daysEvent = {
        target: {
          name: "days",
          value: days
        }
      } as React.ChangeEvent<HTMLInputElement>;

      handleFormChange(daysEvent);
    }
  };

  // Handler para mudança de data final
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    handleFormChange(e);

    // Atualizar o número de dias se a data inicial existir
    if (localFormData.startDate) {
      const days = calculateDays(localFormData.startDate, newEndDate);
      const daysEvent = {
        target: {
          name: "days",
          value: days
        }
      } as React.ChangeEvent<HTMLInputElement>;

      handleFormChange(daysEvent);
    }
  };

  // Handler para mudança no campo de dias
  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value, 10);
    handleFormChange(e);

    // Atualizar a data final com base na data inicial + dias
    if (localFormData.startDate && !isNaN(days)) {
      try {
        const [startDay, startMonth, startYear] = localFormData.startDate.split('/').map(Number);
        const startDate = new Date(startYear, startMonth - 1, startDay);

        // Adicionar o número de dias à data inicial
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days);

        // Formatar a nova data final
        const endDay = endDate.getDate().toString().padStart(2, '0');
        const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
        const endYear = endDate.getFullYear();
        const formattedEndDate = `${endDay}/${endMonth}/${endYear}`;

        const endDateEvent = {
          target: {
            name: "endDate",
            value: formattedEndDate
          }
        } as React.ChangeEvent<HTMLInputElement>;

        handleFormChange(endDateEvent);
      } catch (error) {
        console.error('Erro ao calcular data final:', error);
      }
    }
  };

  // Formatar valor de garantia com máscara R$
  const formatCurrency = (value: string) => {
    // Log para debug
    console.log('Valor antes de formatar:', value);

    // Remove todos os caracteres não numéricos, incluindo R$, espaços e pontuações
    let numericValue = value.replace(/[^0-9]/g, '');

    // Se o valor for vazio, use 0
    if (!numericValue) numericValue = '0';

    console.log('Valor numérico extraído:', numericValue);

    // Converter para número e formatar com 2 casas decimais
    const amount = parseInt(numericValue, 10) / 100;
    const formatted = `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    console.log('Valor formatado final:', formatted);
    return formatted;
  };

  // Handler para o valor de garantia
  const handleGuaranteeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    console.log('Valor recebido no handleGuaranteeValueChange:', rawValue);

    // Obter a moeda atual do formulário
    const currentCurrency = localFormData.currency;

    // Configurações para cada moeda
    const currencySettings = {
      'BRL': { symbol: 'R$ ', locale: 'pt-BR', decimalSeparator: ',', thousandSeparator: '.' },
      'USD': { symbol: '$ ', locale: 'en-US', decimalSeparator: '.', thousandSeparator: ',' },
      'EUR': { symbol: '€ ', locale: 'de-DE', decimalSeparator: ',', thousandSeparator: '.' },
      'GBP': { symbol: '£ ', locale: 'en-GB', decimalSeparator: '.', thousandSeparator: ',' }
    };

    // Usar as configurações da moeda atual ou padrão para BRL
    const settings = currencySettings[currentCurrency as keyof typeof currencySettings] || currencySettings['BRL'];

    // NOVO: Detectar se estamos apenas digitando um novo dígito
    // Verificar se o rawValue já tem um símbolo de moeda
    if (rawValue.includes(settings.symbol)) {
      // Se já tem o símbolo, verificar se estamos adicionando dígitos
      const lastChar = rawValue.charAt(rawValue.length - 1);
      const isDigit = /\d/.test(lastChar);

      if (isDigit) {
        // Estamos adicionando um dígito ao final
        // Extrair apenas os números da string inteira
        let allDigits = rawValue.replace(/[^\d]/g, '');

        // Se temos dígitos, formatar como valor monetário
        if (allDigits) {
          // Converter para um valor numérico (em unidades, não centavos)
          const amount = parseInt(allDigits) / 100;

          // Formatar o valor de acordo com o locale da moeda
          const formattedValue = settings.symbol + amount.toLocaleString(settings.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });

          console.log('Valor formatado para moeda (novo dígito):', currentCurrency, formattedValue);

          // Criar um novo evento com o nome correto
          const event = {
            target: {
              name: 'guaranteeValue',
              value: formattedValue
            }
          } as React.ChangeEvent<HTMLInputElement>;

          // Atualizar o estado local diretamente
          setLocalFormData(prev => ({
            ...prev,
            guaranteeValue: formattedValue
          }));

          // Enviar para o componente pai
          if (onChange) {
            onChange(event);
          }

          setShowSummary(true);
          return;
        }
      }
    }

    // Se chegamos aqui, não estamos adicionando um dígito ou o processamento falhou
    // Tratar como uma entrada manual completa

    // Remover tudo exceto números e marcadores decimais
    let cleanValue = rawValue.replace(/[^\d,.]/g, '');

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

    console.log('Valor formatado para moeda (entrada manual):', currentCurrency, formattedValue);

    // Criar um novo evento com o nome correto
    const event = {
      target: {
        name: 'guaranteeValue',
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;

    // Atualizar o estado local diretamente
    setLocalFormData(prev => ({
      ...prev,
      guaranteeValue: formattedValue
    }));

    // Enviar para o componente pai
    if (onChange) {
      onChange(event);
    }

    setShowSummary(true);
  };

  // Handler específico para mudança de modalidade
  const handleModalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Este evento será passado para o onChange nas props
    handleFormChange(e);

    // Também atualiza o estado local para refletir a mudança imediatamente
    const newValue = e.target.value;
    console.log("modalidade => ", newValue);

    setLocalFormData(prev => ({
      ...prev,
      modalidade: newValue,
      // Comentar ou remover esta linha se não quiser resetar a cobertura
      // cobertura: ""
    }));
  };

  // Handler específico para mudança de cobertura
  const handleCoverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFormChange(e);

    const newValue = e.target.value;
    console.log("cobertura => ", newValue);

    setLocalFormData(prev => ({
      ...prev,
      cobertura: newValue
    }));
  };

  // Dados de resumo calculados com base nos valores do formulário
  const summary = {
    modalidade: localFormData.modalidade,
    cobertura: localFormData.cobertura,
    valorGarantia: localFormData.guaranteeValue,
    inicioVigencia: localFormData.startDate,
    finalVigencia: localFormData.endDate,
    dias: localFormData.days,
    premioTotal: `R$ ${(parseFloat(localFormData.guaranteeValue.replace(/[^0-9.,]/g, "").replace(",", ".") || "0") * 0.05).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  };

  const handleCancel = () => {
    setShowSummary(false);
  };

  return (
      <div className="w-full flex space-x-6">
        {/* Formulário */}
        <div className={`${showSummary ? "w-1/2" : "w-full"} transition-all duration-300`}>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            {/* Modalidades dropdown */}
            <ModalitySelection
                value={localFormData.modalidade}
                onChange={handleModalityChange}
            />

            {/* Coberturas dropdown */}
            <CoverageSelection
                modalityId={localFormData.modalidade}
                value={localFormData.cobertura || ""}
                onChange={handleCoverageChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Início Vigência */}
              <DatePicker
                  name="startDate"
                  value={localFormData.startDate}
                  onChange={handleStartDateChange}
                  label={t('inicio_vigencia', 'Início Vigência')}
              />

              {/* Dia(s) */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  {t('dias', 'Dia(s)')}
                </label>
                <div className="relative">
                  <input
                      type="text"
                      name="days"
                      value={localFormData.days}
                      onChange={handleDaysChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Final Vigência */}
              <DatePicker
                  name="endDate"
                  value={localFormData.endDate}
                  onChange={handleEndDateChange}
                  label={t('final_vigencia', 'Final Vigência')}
              />

              {/* Valor Garantia */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  {t('valor_garantia', 'Valor Garantia')}
                </label>
                <input
                    type="text"
                    name="guaranteeValue"
                    value={localFormData.guaranteeValue}
                    onChange={handleGuaranteeValueChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Moeda */}
            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-1">
                {t('moeda', 'Moeda')}
              </label>
              <div className="relative w-40">
                <select
                    name="currency"
                    value={localFormData.currency}
                    onChange={handleFormChange}
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

            {/* Botões */}
            <div className="flex justify-between mt-8">
              <button
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={onGenerateQuote}
              >
                {t('abrir_conta', 'Abrir Conta')}
              </button>
              <button
                  className="px-6 py-3 text-gray-700 hover:text-gray-900"
                  onClick={handleCancel}
              >
                {t('cancelar', 'Cancelar')}
              </button>
            </div>
          </div>
        </div>

        {/* Resumo do Pedido (aparece automaticamente quando o usuário interage com o formulário) */}
        {showSummary && (
            <div className="w-1/2 bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-5">
                {t('resumo_do_pedido', 'Resumo do Pedido')}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('modalidade', 'Modalidade')}:</span>
                  <span className="font-semibold">{summary.modalidade}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('cobertura', 'Cobertura')}:</span>
                  <span className="font-semibold">{summary.cobertura}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('valor_garantia', 'Valor Garantia')}:</span>
                  <span className="font-semibold">{summary.valorGarantia}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('inicio_vigencia', 'Início Vigência')}:</span>
                  <span className="font-semibold">{summary.inicioVigencia}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('final_vigencia', 'Final Vigência')}:</span>
                  <span className="font-semibold">{summary.finalVigencia}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('n_dias_cobertura', 'N. Dia(s) Cobertura')}:</span>
                  <span className="font-semibold">{summary.dias}</span>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <span className="text-gray-600">{t('premio_total', 'Prêmio Total')}:</span>
                  <span className="font-semibold text-blue-600">
                                {summary.premioTotal}
                            </span>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdvancedTabUpdated;
