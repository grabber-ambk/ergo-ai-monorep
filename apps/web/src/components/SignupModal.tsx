// SignupModal.tsx
import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    signupFormData: {
        companyName: string;
        fullName: string;
        taxId: string;
        email: string;
        phone: string;
    };
    selectedCountry: string;
    onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSignupFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSignupSubmit: (e: React.FormEvent) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({
                                                     isOpen,
                                                     onClose,
                                                     signupFormData,
                                                     selectedCountry,
                                                     onCountryChange,
                                                     onSignupFormChange,
                                                     onSignupSubmit
                                                 }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay with 70% opacity */}
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md z-10 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Crie sua conta</h2>

                {/* Info box for existing users */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                    <div className="mr-3 mt-1">
                        <Info size={20} className="text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Já é cliente?</h3>
                        <a href="#" className="text-blue-500 hover:text-blue-600">Faça login</a>
                    </div>
                </div>

                <form onSubmit={onSignupSubmit}>
                    {/* Country Selection */}
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            País
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
                            Nome Empresa
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={signupFormData.companyName}
                            onChange={onSignupFormChange}
                            className="w-full p-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder=""
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
                            placeholder="Nome Completo"
                        />
                    </div>

                    {/* Tax ID */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {selectedCountry === 'BR' ? 'CNPJ - Tomador' : 'EIN - Tax ID'}
                        </label>
                        <input
                            type="text"
                            name="taxId"
                            value={signupFormData.taxId}
                            onChange={onSignupFormChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder={selectedCountry === 'BR' ? "__.___.___/____-__" : "___-__-____"}
                        />
                    </div>

                    {/* User Profile Section */}
                    <div className="mb-4">
                        <label className="block bg-gray-800 text-white p-3 font-medium rounded-t-lg">
                            Perfil Usuário
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
                            placeholder="Email Profissional"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Celular/WhatsApp
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={signupFormData.phone}
                            onChange={onSignupFormChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder={selectedCountry === 'BR' ? "+55 (___) _____-____" : "+1 (___) ___-____"}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-red-500 hover:text-red-600 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                        >
                            Continuar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupModal;
