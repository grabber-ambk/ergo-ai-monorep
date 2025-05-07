// apps/web/src/app/api/modalities/route.ts
import { NextResponse } from 'next/server';
import { getServerActiveModalitiesByLanguage } from '@ergo-ai/api-server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const simplifiedLocale = locale.substring(0, 2);

    try {
        console.log(`Buscando modalidades para idioma simplificado: ${simplifiedLocale}`);

        // Buscar modalidades do servidor
        const modalities = await getServerActiveModalitiesByLanguage(simplifiedLocale);

        // Formatar modalidades para o formato esperado pelo componente
        const formattedModalities = modalities.map((item) => ({
            id: item.id || `id-${Math.random()}`,
            name: item.name || "Modalidade sem nome"
        }));

        return NextResponse.json(formattedModalities);
    } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar modalidades' },
            { status: 500 }
        );
    }
}
