import { OAuth2Client } from 'google-auth-library';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserInfo } from '../types/auth';

/**
 * Verifica um token ID do Google e retorna as informações do usuário
 * @param token Token ID do Google
 * @param clientId Client ID do Google OAuth
 * @returns Informações do usuário extraídas do token
 */
export async function verifyGoogleToken(token: string, clientId: string): Promise<UserInfo> {
    try {
        // Configurar cliente do Google OAuth
        const client = new OAuth2Client(clientId);

        // Verificar o token com o Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
        });

        // Extrair a payload do token
        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error('Token inválido');
        }

        // Extrair informações do usuário da payload
        const { sub, email, name, picture } = payload;

        // Retornar informações do usuário em um formato padronizado
        return {
            id: sub || '',
            email: email || '',
            name: name || '',
            picture: picture,
            provider: 'google'
        };
    } catch (error) {
        console.error('Erro ao verificar token do Google:', error);
        throw new Error('Falha na verificação do token do Google');
    }
}

/**
 * Gera um token JWT para o usuário
 * @param user Informações do usuário para incluir no token
 * @param jwtSecret Chave secreta para assinar o token
 * @param expiresIn Tempo de validade do token
 * @returns Token JWT gerado
 */
export function generateAuthToken(
    user: UserInfo,
    jwtSecret: string,
    expiresIn: string = '7d'
): string {
    // Usando qualquer tipagem para evitar problemas
    const payload = { userId: user.id, email: user.email };

    // Hack para contornar o problema de tipagem
    const sign = (jwt.sign as any);
    return sign(payload, jwtSecret, { expiresIn });
}

/**
 * Verifica um token JWT e retorna a payload decodificada
 * @param token Token JWT para verificar
 * @param jwtSecret Chave secreta para verificar o token
 * @returns Payload decodificada
 */
export function verifyAuthToken(token: string, jwtSecret: string): any {
    try {
        const verify = (jwt.verify as any);
        return verify(token, jwtSecret);
    } catch (error) {
        console.error('Erro ao verificar token JWT:', error);
        throw new Error('Token JWT inválido');
    }
}
