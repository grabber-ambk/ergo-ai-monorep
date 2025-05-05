"use client"

import { useState } from 'react';
import { useTranslation } from "@ergo-ai/i18n";
import { useFileUpload } from "@ergo-ai/hooks/src/useFileUpload";
// Importar os componentes diretamente dos arquivos
import AuthProvider, { useAuthContext } from "../../../../packages/features/src/auth/AuthProvider";
import QuoteProvider, { useQuoteContext } from "../../../../packages/features/src/quotes/QuoteProvider";

import {
    MainLayout,
    Sidebar,
    Header,
    LanguageSelector,
    UserProfileMenu
} from "@ergo-ai/ui";

// Import existing components - a seguir seriam migrados gradualmente também
import SignupMultiStepModal from "@/components/SignupMultiStepModal";
import LoginModal from "@/components/LoginModal";
import UploadStageUpdated from "@/components/UploadStageUpdated";
import QuoteConfirm from "@/components/QuoteConfirm";
import QuoteResult from "@/components/QuoteResult";
import PreviousQuotes from "@/components/PreviousQuotes";
import SearchIntegration from "@/components/SearchIntegration";

const ErgoSingleHome = () => {
    const { t, i18n } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [uploadedFilename, setUploadedFilename] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);

    const {
        handleFileSelect,
        resetUpload,
    } = useFileUpload();

    // Toggle sidebar function
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Função para lidar com uploads de arquivos
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filename = 'SEI_64182677_Oficio_121.pdf';
        setUploadedFilename(filename);
        setFileSize('49 KB');
        setFileUploaded(true);

        // Optionally set the actual file if it exists
        if (e?.target?.files?.[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Wrapper para componentes Auth
    const AuthModalWrapper = () => {
        const {
            showLoginModal,
            showSignupModal,
            handleCloseLoginModal,
            handleOpenSignupModal,
            handleCloseSignupModal,
            signupFormData,
            selectedCountry,
            handleCountryChange,
            handleSignupFormChange,
            handleSignupSubmit
        } = useAuthContext();

        return (
            <>
                {showLoginModal && (
                    <LoginModal
                        isOpen={showLoginModal}
                        onClose={handleCloseLoginModal}
                        onSignup={handleOpenSignupModal}
                    />
                )}

                {showSignupModal && (
                    <SignupMultiStepModal
                        isOpen={showSignupModal}
                        onClose={handleCloseSignupModal}
                        signupFormData={signupFormData}
                        selectedCountry={selectedCountry}
                        onCountryChange={handleCountryChange}
                        onSignupFormChange={handleSignupFormChange}
                        onSignupSubmit={handleSignupSubmit}
                    />
                )}
            </>
        );
    };

    // Wrapper para conteúdo principal
    const MainContent = () => {
        const {
            quoteStage,
            quoteData,
            activeTab,
            formData,
            handleFormChange,
            handleNewQuote,
            handleGenerateQuote,
            handleGenerateAdvancedQuote,
            handleConfirmQuote,
            handleTabChange,
            handleSelectQuote,
            mockPreviousQuotesData
        } = useQuoteContext();

        const { handleOpenSignupModal } = useAuthContext();

        return (
            <>
                {quoteStage === 'upload' && (
                    <UploadStageUpdated
                        activeTab={activeTab}
                        handleTabChange={handleTabChange}
                        fileUploaded={fileUploaded}
                        uploadedFilename={uploadedFilename}
                        fileSize={fileSize}
                        advancedFormData={formData}
                        handleAdvancedFormChange={handleFormChange}
                        handleFileSelected={handleFileSelected}
                        handleGenerateQuote={handleGenerateQuote}
                        handleGenerateAdvancedQuote={handleGenerateAdvancedQuote}
                    />
                )}

                {quoteStage === 'confirm' && (
                    <QuoteConfirm
                        quoteData={quoteData}
                        handleNewQuote={handleNewQuote}
                        handleConfirmQuote={handleConfirmQuote}
                    />
                )}

                {quoteStage === 'result' && (
                    <QuoteResult
                        quoteData={quoteData}
                        handleNewQuote={handleNewQuote}
                        handleOpenSignupModal={handleOpenSignupModal}
                    />
                )}
            </>
        );
    };

    // Componentes para layout
    const SidebarComponent = () => {
        const { handleNewQuote, mockPreviousQuotesData, handleSelectQuote } = useQuoteContext();

        return (
            <Sidebar
                isOpen={sidebarOpen}
                onNewQuote={handleNewQuote}
                quotes={mockPreviousQuotesData}
                onSelectQuote={handleSelectQuote}
                PreviousQuotes={PreviousQuotes}
            />
        );
    };

    const HeaderComponent = () => {
        const SearchComponent = ({ onSelectQuote }: { onSelectQuote: (quoteData: any) => void }) => (
            <SearchIntegration onSelectQuote={onSelectQuote} />
        );

        const { setQuoteData, setQuoteStage } = useQuoteContext();

        const handleSearchQuoteSelect = (quoteData: any) => {
            setQuoteData(quoteData);
            setQuoteStage('result');
        };

        return (
            <Header
                isSidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                LanguageSelector={<LanguageSelector />} // Remove a passagem do i18n
                UserProfileMenu={<UserProfileMenu />}
                SearchIntegration={<SearchComponent onSelectQuote={handleSearchQuoteSelect} />}
            />
        );
    };

    return (
        <AuthProvider>
            <QuoteProvider resetUpload={resetUpload}>
                <MainLayout
                    header={<HeaderComponent />}
                    sidebar={<SidebarComponent />}
                >
                    <MainContent />
                </MainLayout>
                <AuthModalWrapper />
            </QuoteProvider>
        </AuthProvider>
    );
};

export default ErgoSingleHome;
