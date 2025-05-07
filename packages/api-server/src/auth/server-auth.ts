import { cookies } from 'next/headers';
import { jwtAxios } from '@ergo-ai/api-client';

export async function serverApiRequest(endpoint: string, options: any = {}) {
    try {
        // Adicionar um bloco de segurança
        let token = null;
        try {
            const cookieStore = await cookies();
            token = cookieStore.get('token')?.value;
        } catch (e) {
            console.log('Erro ao acessar cookies:', e);
        }

        const config = {
            url: endpoint,
            ...options,
            headers: {
                ...options.headers,
                ...(token && { Authorization: `Bearer ${token}` })
            }
        };

        const response = await jwtAxios(config);
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer requisição do servidor:', error);
        throw error;
    }
}
