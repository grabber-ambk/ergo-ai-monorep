import React from 'react';
interface SignupFormData {
    companyName: string;
    fullName: string;
    taxId: string;
    email: string;
    phone: string;
}
interface AuthContextType {
    showLoginModal: boolean;
    showSignupModal: boolean;
    signupFormData: SignupFormData;
    selectedCountry: string;
    handleOpenLoginModal: () => void;
    handleCloseLoginModal: () => void;
    handleOpenSignupModal: () => void;
    handleCloseSignupModal: () => void;
    handleCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSignupFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSignupSubmit: (e: React.FormEvent) => void;
}
interface AuthProviderProps {
    children: React.ReactNode;
    showLoginAfterSeconds?: number;
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export declare const useAuthContext: () => AuthContextType;
export default AuthProvider;
