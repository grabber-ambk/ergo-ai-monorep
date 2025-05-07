// packages/ui/src/server/ModalityListServer.tsx
import { getServerActiveModalitiesByLanguage } from '@ergo-ai/api-client/src/server/modality';
import { ModalitySelectorClient } from '../client/ModalitySelectorClient';

interface ModalityListServerProps {
    locale: string;
}

export async function ModalityListServer({ locale }: ModalityListServerProps) {
    // Buscar dados no servidor
    const modalities = await getServerActiveModalitiesByLanguage(locale);

    // Preparar dados para o componente cliente
    const formattedModalities = modalities.map((modality) => ({
        id: modality.id,
        name: modality.translations.find(
            (translation) => translation.languageCode === locale
        )?.name || modality.translations[0].name,
    }));

    // Renderizar o componente cliente com dados pré-carregados
    return <ModalitySelectorClient initialModalities={formattedModalities} />;
}
