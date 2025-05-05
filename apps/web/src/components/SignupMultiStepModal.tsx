// SignupMultiStepModal.tsx
import React, { useState } from 'react';
import { Info, X, Check } from 'lucide-react';
import { useTranslation } from "@ergo-ai/i18n/src/client";

interface SignupFormData {
    companyName: string;
    fullName: string;
    taxId: string;
    email: string;
    phone: string;
}

interface SignupMultiStepModalProps {
    isOpen: boolean;
    onClose: () => void;
    signupFormData: SignupFormData;
    selectedCountry: string;
    onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSignupFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSignupSubmit: (e: React.FormEvent) => void;
}

const SignupMultiStepModal: React.FC<SignupMultiStepModalProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       signupFormData,
                                                                       selectedCountry,
                                                                       onCountryChange,
                                                                       onSignupFormChange,
                                                                       onSignupSubmit
                                                                   }) => {
    // Obtém apenas a função de tradução e o objeto i18n
    const { t, i18n } = useTranslation();
    const locale = i18n.language; // Obtém o idioma atual diretamente do objeto i18n

    const [currentStep, setCurrentStep] = useState<'form' | 'review' | 'completed'>('form');

    if (!isOpen) return null;

    // Formatar o telefone para exibição
    const formatPhoneForDisplay = (phone: string) => {
        if (selectedCountry === 'BR') {
            // Formato brasileiro
            return phone;
        } else {
            // Formato internacional
            return phone;
        }
    };

    // Função para lidar com a mudança de etapa
    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep === 'form') {
            setCurrentStep('review');
        } else if (currentStep === 'review') {
            onSignupSubmit(e);
            setCurrentStep('completed');
        }
    };

    // Função para voltar para a etapa anterior
    const handlePreviousStep = () => {
        if (currentStep === 'review') {
            setCurrentStep('form');
        }
    };

    // Renderizar a barra de progresso
    const ProgressBar = () => (
        <div className="flex items-center justify-center mb-6">
            <div className="relative w-full max-w-md flex items-center">
                {/* Linha de progresso */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>

                {/* Etapa 1 */}
                <div className="relative flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full z-10 
            ${currentStep === 'form'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-500 text-white'}`}>
                        {currentStep === 'form' ? '1' : <Check size={16} />}
                    </div>
                    <span className="text-sm mt-2 text-gray-600">{t('revisar_cadastro')}</span>
                </div>

                {/* Etapa 2 */}
                <div className="relative flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full z-10 
            ${currentStep === 'review' || currentStep === 'completed'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-500'}`}>
                        2
                    </div>
                    <span className="text-sm mt-2 text-gray-600">{t('finalizar_cadastro')}</span>
                </div>
            </div>
        </div>
    );

    // Etapa 1: Formulário
    const FormStep = () => (
        <form onSubmit={handleNextStep}>
            {/* Country Selection */}
            <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pais')}
                </label>
                <select
                    id="country"
                    value={selectedCountry}
                    onChange={onCountryChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="BR">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="CA">Canadá</option>
                    <option value="ES">Espanha</option>
                    <option value="PT">Portugal</option>
                    <option value="AR">Argentina</option>
                    <option value="CL">Chile</option>
                    <option value="MX">México</option>
                </select>
            </div>

            {/* Company Name */}
            <div className="mb-4">
                <label className="block bg-gray-800 text-white p-3 font-medium rounded-t-lg">
                    {t('nome_empresa')}
                </label>
                <input
                    type="text"
                    name="companyName"
                    value={signupFormData.companyName}
                    onChange={onSignupFormChange}
                    className="w-full p-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder=""
                    required
                />
            </div>

            {/* Full Name */}
            <div className="mb-4">
                <input
                    type="text"
                    name="fullName"
                    value={signupFormData.fullName}
                    onChange={onSignupFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={t('nome_completo')}
                    required
                />
            </div>

            {/* Tax ID */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedCountry === 'BR' ? t('cnpj_tomador') : t('ein_tax_id')}
                </label>
                <input
                    type="text"
                    name="taxId"
                    value={signupFormData.taxId}
                    onChange={onSignupFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={selectedCountry === 'BR' ? "__.___.___/____-__" : "___-__-____"}
                    required
                />
            </div>

            {/* User Profile Section */}
            <div className="mb-4">
                <label className="block bg-gray-800 text-white p-3 font-medium rounded-t-lg">
                    {t('perfil_usuario')}
                </label>
            </div>

            {/* Email */}
            <div className="mb-4">
                <input
                    type="email"
                    name="email"
                    value={signupFormData.email}
                    onChange={onSignupFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={t('email_profissional')}
                    required
                />
            </div>

            {/* Phone */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('celular_whatsapp')}
                </label>
                <input
                    type="text"
                    name="phone"
                    value={signupFormData.phone}
                    onChange={onSignupFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={selectedCountry === 'BR' ? "+55 (___) _____-____" : "+1 (___) ___-____"}
                    required
                />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-red-500 hover:text-red-600 font-medium"
                >
                    {t('cancelar')}
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                >
                    {t('continuar')}
                </button>
            </div>
        </form>
    );

    // Etapa 2: Revisão
    const ReviewStep = () => (
        <div className="w-full">
            <h3 className="text-lg font-medium mb-4">{t('revise_ou_edite_as_informacoes')}</h3>

            <div className="space-y-6">
                {/* Informações Pessoais */}
                <div>
                    <h4 className="font-medium text-gray-800 mb-3">{t('informacoes_pessoais')}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <p className="text-sm text-gray-500">{t('nome')}:</p>
                            <p className="font-medium">{signupFormData.fullName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">{t('email')}:</p>
                            <p className="font-medium">{signupFormData.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">{t('telefone')}:</p>
                            <p className="font-medium">{formatPhoneForDisplay(signupFormData.phone)}</p>
                        </div>
                    </div>
                </div>

                {/* Informações da Empresa */}
                <div>
                    <h4 className="font-medium text-gray-800 mb-3">{t('informacoes_da_empresa')}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <p className="text-sm text-gray-500">{selectedCountry === 'BR' ? 'CNPJ' : 'EIN/Tax ID'}:</p>
                            <p className="font-medium">{signupFormData.taxId}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">{t('razao_social')}:</p>
                            <p className="font-medium">{signupFormData.companyName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">{t('pais')}:</p>
                            <p className="font-medium">
                                {selectedCountry === 'BR' ? 'Brasil' :
                                    selectedCountry === 'US' ? 'Estados Unidos' :
                                        selectedCountry === 'CA' ? 'Canadá' :
                                            selectedCountry === 'ES' ? 'Espanha' :
                                                selectedCountry === 'PT' ? 'Portugal' :
                                                    selectedCountry === 'AR' ? 'Argentina' :
                                                        selectedCountry === 'CL' ? 'Chile' :
                                                            selectedCountry === 'MX' ? 'México' : selectedCountry}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                    {t('voltar')}
                </button>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-red-500 hover:text-red-600 font-medium"
                    >
                        {t('cancelar')}
                    </button>
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                    >
                        {t('finalizar')}
                    </button>
                </div>
            </div>
        </div>
    );

    // Determine o tamanho do modal com base na etapa atual
    const modalWidth = currentStep === 'form' ? 'max-w-md' : 'max-w-3xl';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay com 70% de opacidade */}
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}></div>

            {/* Conteúdo do Modal */}
            <div className={`bg-white rounded-xl shadow-xl w-full ${modalWidth} z-10 p-6 relative transition-all duration-300`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-4">{t('crie_sua_conta')}</h2>

                {/* Info box para usuários existentes */}
                {currentStep === 'form' && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                        <div className="mr-3 mt-1">
                            <Info size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">{t('ja_e_cliente')}</h3>
                            <a href="#" className="text-blue-500 hover:text-blue-600">{t('faca_login')}</a>
                        </div>
                    </div>
                )}

                {/* Barra de Progresso */}
                <ProgressBar />

                {/* Conteúdo baseado na etapa atual */}
                {currentStep === 'form' && <FormStep />}
                {currentStep === 'review' && <ReviewStep />}
            </div>
        </div>
    );
};

export default SignupMultiStepModal;
