// packages/api-client/src/endpoints/coverage.ts
import jwtAxios from '../auth/jwt-auth';
import { ApiResponseFormat } from '@ergo-ai/api-client/types';

// Tipo para as coberturas traduzidas
interface TranslatedCoverage {
    id: string;
    coverageId: string | null;
    languageCode: string;
    name: string | null;
    coverage: {
        id: string;
        modalityId: string;
        status: number | null;
        modality: {
            id: string;
            status: number | null;
            translation: string | null;
        };
    };
}

// Tipo para a resposta da API de coberturas traduzidas
type GetTranslatedCoveragesResponse = ApiResponseFormat<TranslatedCoverage[]>;

// Busca todas as coberturas traduzidas
export async function getTranslatedCoverages() {
    const response = await jwtAxios.get<GetTranslatedCoveragesResponse>('/coverages');
    return response.data.data;
}

// Tipo para a cobertura pelo ID
interface CoverageById {
    id: string;
    coverageId: string;
    catId: string;
    status: number;
    translations: {
        id: string;
        coverageId: string;
        languageCode: string;
        name: string;
    }[];
    cat: {
        id: string;
        areaID: string;
        status: number;
        parentId: string | null;
        fixed: boolean;
        translations: {
            id: string;
            languageCode: string;
            name: string;
        }[];
    };
}

// Tipo para a resposta da API de cobertura por ID
type GetCoverageByIdResponse = ApiResponseFormat<CoverageById>;

// Busca uma cobertura específica pelo ID
export async function getCoverageById(id: string) {
    const response = await jwtAxios.get<GetCoverageByIdResponse>(`/coverages/${id}`);
    return response.data.data;
}

// Interface simplificada para coberturas
interface Coverage {
    id: string;
    name: string;
}

// Tipo para a resposta da API de coberturas por modalidade
type GetCoveragesByModalityNameResponse = ApiResponseFormat<Coverage[]>;

// Busca coberturas por ID da modalidade
export async function getCoveragesByModalityName(name: string) {
    try {
        console.log('Buscando coberturas para modalidade NOME:', name);
        // Atenção à barra inicial e ao formato do endpoint
        const response = await jwtAxios.get<GetCoveragesByModalityNameResponse>(
            `/modalities/${name}/coverages`
        );
        console.log('Coberturas encontradas:', response.data.data);
        return response.data.data;
    } catch (error: unknown) {
        console.error(`Erro ao buscar coberturas para modalidade NOME ${name}:`, error);
        throw error;
    }
}

// Se precisar do parâmetro de idioma como no código antigo:
export async function getCoveragesByModalityIdAndLanguage(modalityId: string, language: string) {
    try {
        console.log(`Buscando coberturas para modalidade ID: ${modalityId}, idioma: ${language}`);
        const response = await jwtAxios.get<any>(
            `/modalities/${modalityId}/coverages/${language}`
        );
        console.log('Coberturas encontradas:', response.data.data);
        return response.data.data;
    } catch (error: unknown) {
        console.error(`Erro ao buscar coberturas para modalidade ID ${modalityId}, idioma ${language}:`, error);
        throw error;
    }
}

// Desativa uma cobertura específica
export async function disableCoverage(id: string) {
    await jwtAxios.patch(`/coverages/${id}/disable`);  // Added leading slash
}

// Ativa uma cobertura específica
export async function activeCoverage(id: string) {
    await jwtAxios.patch(`/coverages/${id}/active`);  // Added leading slash
}

// Tipo para o pedido de criação de cobertura
type CreateCoverageRequest = {
    modalityName: string;
    namePt: string;
    nameEn: string;
};

// Cria uma nova cobertura
export async function createCoverage(request: CreateCoverageRequest) {
    const response = await jwtAxios.post('/coverages', request);
    return response.data.data;
}

// Tipo para o pedido de edição de cobertura
type EditCoverageRequest = {
    id: string;
    namePt?: string;
    nameEn?: string;
};

// Edita uma cobertura existente
export async function editCoverage(request: EditCoverageRequest) {
    const { id, ...data } = request;
    const response = await jwtAxios.patch(`/coverages/${id}`, data);
    return response.data.data;
}
