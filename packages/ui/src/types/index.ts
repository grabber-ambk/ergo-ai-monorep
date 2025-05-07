// packages/ui/src/types/index.ts
export interface Modality {
    id: string;
    name: string;
    translations?: Array<{
        languageCode: string;
        name: string;
    }>;
}

export interface Coverage {
    id: string;
    name: string;
}
