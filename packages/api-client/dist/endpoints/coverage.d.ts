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
export declare function getTranslatedCoverages(): Promise<TranslatedCoverage[]>;
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
export declare function getCoverageById(id: string): Promise<CoverageById>;
interface Coverage {
    id: string;
    name: string;
}
export declare function getCoveragesByModalityName(name: string): Promise<Coverage[]>;
export declare function getCoveragesByModalityIdAndLanguage(modalityId: string, language: string): Promise<any>;
export declare function disableCoverage(id: string): Promise<void>;
export declare function activeCoverage(id: string): Promise<void>;
type CreateCoverageRequest = {
    modalityName: string;
    namePt: string;
    nameEn: string;
};
export declare function createCoverage(request: CreateCoverageRequest): Promise<any>;
type EditCoverageRequest = {
    id: string;
    namePt?: string;
    nameEn?: string;
};
export declare function editCoverage(request: EditCoverageRequest): Promise<any>;
export {};
