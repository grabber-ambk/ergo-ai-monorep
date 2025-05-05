import React, { createContext, useContext, useState, useEffect } from 'react';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    showLoginAfterSeconds?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
    showLoginAfterSeconds = 30
}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('BR');

    // Signup form data
    const [signupFormData, setSignupFormData] = useState({
        companyName: '',
        fullName: '',
        taxId: '',
        email: '',
        phone: '+55'
    });

    // Effect to show login modal after specified seconds
    useEffect(() => {
        const loginTimer = setTimeout(() => {
            setShowLoginModal(true);
        }, showLoginAfterSeconds * 1000);

        return () => clearTimeout(loginTimer);
    }, [showLoginAfterSeconds]);

    // Modal handlers
    const handleOpenLoginModal = () => setShowLoginModal(true);
    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleOpenSignupModal = () => {
        setShowSignupModal(true);
        setShowLoginModal(false); // Fechar o modal de login se estiver aberto
    };
    const handleCloseSignupModal = () => setShowSignupModal(false);

    // Handle country change
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = e.target.value;
        setSelectedCountry(country);

        // Reset tax ID field when changing country
        setSignupFormData({
            ...signupFormData,
            taxId: '',
            phone: country === 'BR' ? '+55' : '+1' // Simple example - adjust as needed
        });
    };

    // Handle signup form changes
    const handleSignupFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupFormData({
            ...signupFormData,
            [name]: value
        });
    };

    // Process signup form submission
    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signup data:', signupFormData);
        // Process signup logic here

        // No final, feche o modal
        setTimeout(() => {
            handleCloseSignupModal();
        }, 1000);
    };

    const value: AuthContextType = {
        showLoginModal,
        showSignupModal,
        signupFormData,
        selectedCountry,
        handleOpenLoginModal,
        handleCloseLoginModal,
        handleOpenSignupModal,
        handleCloseSignupModal,
        handleCountryChange,
        handleSignupFormChange,
        handleSignupSubmit
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
