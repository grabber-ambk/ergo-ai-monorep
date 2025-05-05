import { ModalityWithTranslations } from '@ergo-ai/api-client/types';
export declare function getActiveModalies(): Promise<ModalityWithTranslations[]>;
interface Coverage {
    id: string;
    name: string;
}
export declare function getModalityCoverages(name: string): Promise<Coverage[]>;
export declare function getActiveModalitiesByLanguage(language: string): Promise<any>;
export {};
