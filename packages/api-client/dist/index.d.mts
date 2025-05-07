import * as axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

declare const jwtAxios: axios.AxiosInstance;
declare const setAuthToken: (token?: string) => void;
declare const setSystem: (System?: string) => void;

interface ApiResponseFormat<T> {
    data: T;
    message: string;
    status: number;
    success: boolean;
}

interface ModalityTranslation {
    id: string;
    languageCode: string;
    name: string;
    modalityId: string;
}
interface Modality {
    id: string;
    areaID: string;
    status: number;
    parentId: string | null;
    fixed: boolean;
}
interface ModalityWithTranslations extends Modality {
    translations: ModalityTranslation[];
}

declare function getActiveModalies(): Promise<ModalityWithTranslations[]>;
interface Coverage$1 {
    id: string;
    name: string;
}
declare function getModalityCoverages(name: string): Promise<Coverage$1[]>;
declare function getActiveModalitiesByLanguage(language: string): Promise<any>;

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
declare function getTranslatedCoverages(): Promise<TranslatedCoverage[]>;
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
declare function getCoverageById(id: string): Promise<CoverageById>;
interface Coverage {
    id: string;
    name: string;
}
declare function getCoveragesByModalityName(name: string): Promise<Coverage[]>;
declare function getCoveragesByModalityIdAndLanguage(modalityId: string, language: string): Promise<any>;
declare function disableCoverage(id: string): Promise<void>;
declare function activeCoverage(id: string): Promise<void>;
type CreateCoverageRequest = {
    modalityName: string;
    namePt: string;
    nameEn: string;
};
declare function createCoverage(request: CreateCoverageRequest): Promise<any>;
type EditCoverageRequest = {
    id: string;
    namePt?: string;
    nameEn?: string;
};
declare function editCoverage(request: EditCoverageRequest): Promise<any>;

/**
 * Versão do cliente React Query segura para o navegador
 * Não importa nenhuma dependência que exija módulos Node.js
 */
declare const queryClient$1: QueryClient;

declare const queryClient: QueryClient;

export { type ApiResponseFormat, type Modality, type ModalityTranslation, type ModalityWithTranslations, activeCoverage, queryClient$1 as browserQueryClient, createCoverage, disableCoverage, editCoverage, getActiveModalies, getActiveModalitiesByLanguage, getCoverageById, getCoveragesByModalityIdAndLanguage, getCoveragesByModalityName, getModalityCoverages, getTranslatedCoverages, jwtAxios, queryClient, setAuthToken, setSystem };
