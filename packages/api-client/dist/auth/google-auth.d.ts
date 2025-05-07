import { UserInfo } from '../types/auth';
/**
 * Verifica um token ID do Google e retorna as informações do usuário
 * @param token Token ID do Google
 * @param clientId Client ID do Google OAuth
 * @returns Informações do usuário extraídas do token
 */
export declare function verifyGoogleToken(token: string, clientId: string): Promise<UserInfo>;
/**
 * Gera um token JWT para o usuário
 * @param user Informações do usuário para incluir no token
 * @param jwtSecret Chave secreta para assinar o token
 * @param expiresIn Tempo de validade do token
 * @returns Token JWT gerado
 */
export declare function generateAuthToken(user: UserInfo, jwtSecret: string, expiresIn?: string): string;
/**
 * Verifica um token JWT e retorna a payload decodificada
 * @param token Token JWT para verificar
 * @param jwtSecret Chave secreta para verificar o token
 * @returns Payload decodificada
 */
export declare function verifyAuthToken(token: string, jwtSecret: string): any;
