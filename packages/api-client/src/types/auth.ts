/**
 * Tipos de provedores de autenticação suportados
 */
export type AuthProvider = 'google' | 'email' | 'apple' | 'facebook' | 'microsoft';

/**
 * Informações básicas do usuário
 */
export interface UserInfo {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: AuthProvider;
    accessToken?: string;
}

/**
 * Resposta da autenticação bem-sucedida
 */
export interface AuthResponse {
    token: string;
    user: UserInfo;
}

/**
 * Resposta de erro de autenticação
 */
export interface AuthError {
    message: string;
    code?: string;
}

/**
 * Payload para autenticação com email
 */
export interface EmailAuthPayload {
    email: string;
    password: string;
}

/**
 * Payload para autenticação com Google
 */
export interface GoogleAuthPayload {
    token: string;
}

/**
 * Payload para registro de usuário
 */
export interface RegisterUserPayload {
    fullName: string;
    email: string;
    companyName: string;
    taxId?: string;
    phone?: string;
    country?: string;
}
