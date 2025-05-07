// packages/api-client/src/types/react-oauth-google.d.ts

declare module '@react-oauth/google' {
    import React from 'react';

    export interface GoogleOAuthProviderProps {
        clientId: string;
        children: React.ReactNode;
        onScriptLoadError?: () => void;
        onScriptLoadSuccess?: () => void;
    }

    export const GoogleOAuthProvider: React.FC<GoogleOAuthProviderProps>;

    export interface UseGoogleLoginProps {
        onSuccess?: (credentialResponse: CredentialResponse) => void;
        onError?: () => void;
        flow?: 'implicit' | 'auth-code';
        scope?: string;
        onNonOAuthError?: (nonOAuthError: NonOAuthError) => void;
    }

    export interface CredentialResponse {
        credential: string;
        clientId: string;
        select_by: string;
    }

    export interface NonOAuthError {
        type: string;
        message: string;
    }

    export function useGoogleLogin(props: UseGoogleLoginProps): () => void;
}
