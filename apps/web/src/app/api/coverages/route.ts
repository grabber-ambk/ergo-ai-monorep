//apps/web/src/app/api/coverages/route.ts
import { NextResponse } from 'next/server';
import { getServerCoveragesByModality } from '@ergo-ai/api-server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const modalityName = searchParams.get('modalityName');

    if (!modalityName) {
        return NextResponse.json(
            { error: 'Modalidade não fornecida' },
            { status: 400 }
        );
    }

    try {
        // Buscar coberturas usando a função server
        const coverages = await getServerCoveragesByModality(modalityName);

        // Retornar as coberturas como JSON
        return NextResponse.json(coverages);
    } catch (error) {
        console.error('Erro ao buscar coberturas:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar coberturas' },
            { status: 500 }
        );
    }
}
