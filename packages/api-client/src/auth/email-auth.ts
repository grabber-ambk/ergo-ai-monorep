import { EmailAuthPayload, UserInfo } from '../types/auth';

/**
 * Autentica um usuário com email e senha
 * Esta é uma implementação simulada que seria substituída pela integração real com o backend
 *
 * @param credentials Credenciais de email e senha do usuário
 * @returns Informações do usuário autenticado
 */
export async function authenticateWithEmail(credentials: EmailAuthPayload): Promise<UserInfo> {
    // Em uma implementação real, você faria uma chamada ao seu serviço de autenticação
    // Aqui estamos apenas simulando

    // Simulação de validação de credenciais
    if (!credentials.email || !credentials.password) {
        throw new Error('Email e senha são obrigatórios');
    }

    // Em produção, você faria uma chamada à API para verificar as credenciais
    // Aqui estamos apenas simulando uma verificação básica
    if (!credentials.email.includes('@') || credentials.password.length < 6) {
        throw new Error('Credenciais inválidas');
    }

    // Simular um usuário de teste
    // Em uma implementação real, você obteria esses dados do seu sistema de autenticação
    return {
        id: `user_${Math.random().toString(36).substring(2, 15)}`,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        provider: 'email'
    };
}

/**
 * Registra um novo usuário com email e senha
 * Esta é uma implementação simulada que seria substituída pela integração real com o backend
 *
 * @param userData Dados do usuário a ser registrado
 * @param password Senha escolhida pelo usuário
 * @returns Informações do usuário registrado
 */
export async function registerWithEmail(userData: {
    email: string;
    name: string;
    password: string;
    company?: string;
}): Promise<UserInfo> {
    // Em uma implementação real, você faria uma chamada ao seu serviço de autenticação
    // para registrar o novo usuário

    // Simulação de validação básica
    if (!userData.email || !userData.name || !userData.password) {
        throw new Error('Dados de usuário incompletos');
    }

    // Simular um usuário recém-criado
    return {
        id: `user_${Math.random().toString(36).substring(2, 15)}`,
        email: userData.email,
        name: userData.name,
        provider: 'email'
    };
}
