// packages/api-server/src/services/modality.ts
import { serverApiRequest } from '../auth/server-auth';
import { cache } from 'react';

// Versão para buscar por idioma
export const getServerActiveModalitiesByLanguage = cache(async (language: string) => {
    try {
        // Converter para formato simplificado (pt-BR -> pt)
        const simplifiedLocale = language.substring(0, 2);
        console.log(`Buscando modalidades para idioma simplificado: ${simplifiedLocale}`);

        // Fazendo a requisição à API
        const response = await serverApiRequest(`/modalities/translations/${simplifiedLocale}/active`);

        // Verificar se temos dados válidos
        if (response && response.data && Array.isArray(response.data)) {
            console.log(`Dados recebidos da API: ${JSON.stringify(response.data.slice(0, 2), null, 2)}`);

            // Retornamos os dados diretamente como vieram da API
            return response.data;
        }

        console.log("Nenhum dado retornado da API ou formato inesperado");
        return [];
    } catch (error) {
        console.error(`Erro ao buscar modalidades para idioma ${language} no servidor:`, error);
        // Dados fallback em caso de erro
        return [
            { id: "garantia-judicial", name: "GARANTIA JUDICIAL" },
            { id: "participar-licitacao", name: "PARTICIPAR DE LICITAÇÃO" },
            { id: "execucao-contratos", name: "EXECUÇÃO DE CONTRATOS" },
            { id: "adiantamento-pagamento", name: "ADIANTAMENTO DE PAGAMENTO" },
            { id: "garantia-financeira", name: "GARANTIA FINANCEIRA" }
        ];
    }
});

// Manter a versão original para compatibilidade
export const getServerActiveModalities = cache(async () => {
    try {
        const response = await serverApiRequest('modalities/active');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar modalidades ativas no servidor:', error);
        return [];
    }
});
