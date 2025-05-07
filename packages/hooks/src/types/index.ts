// packages/hooks/src/types/index.ts

/**
 * Representa uma modalidade de seguro com seus dados básicos
 */
export interface Modality {
    id: string;
    name: string;
    translations?: Array<{
        languageCode: string;
        name: string;
    }>;
}

/**
 * Representa uma cobertura de seguro
 */
export interface Coverage {
    id: string;
    name: string;
}
