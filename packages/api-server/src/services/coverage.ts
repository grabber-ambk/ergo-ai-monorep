// packages/api-server/src/services/coverage.ts
import { serverApiRequest } from '../auth/server-auth';
import { cache } from 'react';

// Buscar coberturas por modalidade do lado do servidor
export const getServerCoveragesByModality = cache(async (modalityName: string) => {
    if (!modalityName) {
        console.log('Nome da modalidade não fornecido para busca de coberturas');
        return [];
    }

    try {
        console.log(`Buscando coberturas para modalidade '${modalityName}' pelo servidor`);
        const response = await serverApiRequest(`/modalities/${modalityName}/coverages`);
        console.log('Coberturas recebidas do servidor:', response.data);
        return response.data || [];
    } catch (error) {
        console.error(`Erro ao buscar coberturas para modalidade ${modalityName} no servidor:`, error);
        // Dados fallback em caso de erro
        return [
            { id: "garantia-pagamento", name: "GARANTIA DE PAGAMENTO" },
            { id: "outras-coberturas", name: "OUTRAS COBERTURAS" }
        ];
    }
});

// Versão para buscar coberturas por modalidade e idioma
export const getServerCoveragesByModalityAndLanguage = cache(async (modalityId: string, language: string) => {
    if (!modalityId || !language) {
        console.log('ID da modalidade ou idioma não fornecidos para busca de coberturas');
        return [];
    }

    try {
        console.log(`Buscando coberturas para modalidade ID: ${modalityId}, idioma: ${language} pelo servidor`);
        const response = await serverApiRequest(`/modalities/${modalityId}/coverages/${language}`);
        console.log('Coberturas recebidas do servidor:', response.data);
        return response.data || [];
    } catch (error) {
        console.error(`Erro ao buscar coberturas para modalidade ID ${modalityId}, idioma ${language} no servidor:`, error);
        return [];
    }
});
