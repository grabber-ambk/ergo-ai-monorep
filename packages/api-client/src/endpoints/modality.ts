// packages/api-client/src/endpoints/modality.ts
import jwtAxios from '../auth/jwt-auth';
import { ApiResponseFormat } from '@ergo-ai/api-client/types';
import { Modality, ModalityWithTranslations } from '@ergo-ai/api-client/types';

type ActiveModalitiesResponse = ApiResponseFormat<ModalityWithTranslations[]>;

export async function getActiveModalies() {
    try {
        console.log('Chamando API de modalidades ativas');
        const response = await jwtAxios.get<ActiveModalitiesResponse>('modalities/active');
        console.log('Resposta recebida:', response.data);
        return response.data.data;
    } catch (error: unknown) {
        console.error('Erro ao buscar modalidades ativas:', error);
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response: { data: any, status: number } };
            console.error('Dados da resposta:', axiosError.response.data);
            console.error('Status do erro:', axiosError.response.status);
        }
        throw error;
    }
}

interface Coverage {
    id: string;
    name: string;
}

type GetCoveragesByModalityNameResponse = ApiResponseFormat<Coverage[]>;

// Renomeando a função para evitar conflito com a função de mesmo nome em coverage.ts
export async function getModalityCoverages(name: string) {
    const response = await jwtAxios.get<GetCoveragesByModalityNameResponse>(
        `modalities/${name}/coverages`
    );
    return response.data.data;
}

export async function getActiveModalitiesByLanguage(language: string) {
    const response = await jwtAxios.get<any>(
        `/modalities/translations/${language}/active`
    );
    return response.data.data;
}
