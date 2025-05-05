export interface ModalityTranslation {
    id: string;
    languageCode: string;
    name: string;
    modalityId: string;
}

export interface Modality {
    id: string;
    areaID: string;
    status: number;
    parentId: string | null;
    fixed: boolean;
}

export interface ModalityWithTranslations extends Modality {
    translations: ModalityTranslation[];
}
