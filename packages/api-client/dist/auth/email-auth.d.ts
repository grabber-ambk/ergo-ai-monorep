import { EmailAuthPayload, UserInfo } from '../types/auth';
/**
 * Autentica um usuário com email e senha
 * Esta é uma implementação simulada que seria substituída pela integração real com o backend
 *
 * @param credentials Credenciais de email e senha do usuário
 * @returns Informações do usuário autenticado
 */
export declare function authenticateWithEmail(credentials: EmailAuthPayload): Promise<UserInfo>;
/**
 * Registra um novo usuário com email e senha
 * Esta é uma implementação simulada que seria substituída pela integração real com o backend
 *
 * @param userData Dados do usuário a ser registrado
 * @param password Senha escolhida pelo usuário
 * @returns Informações do usuário registrado
 */
export declare function registerWithEmail(userData: {
    email: string;
    name: string;
    password: string;
    company?: string;
}): Promise<UserInfo>;
