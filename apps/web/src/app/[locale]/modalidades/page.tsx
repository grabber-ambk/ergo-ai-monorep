// apps/web/src/app/[locale]/modalidades/page.tsx
import { getServerActiveModalitiesByLanguage } from '@ergo-ai/api-server';
import { ModalidadeCoberturaIntegration } from '@ergo-ai/ui';
import { unstable_noStore } from 'next/cache';

// Usar o novo recurso de cache dinâmico do Next.js 15
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ModalidadesPage({
                                                  params
                                              }: {
    params: Promise<{ locale: string }>
}) {
    unstable_noStore();

    const { locale } = await params;
    const simplifiedLocale = locale.substring(0, 2);

    // Usar try/catch para tratamento de erro
    try {
        const modalities = await getServerActiveModalitiesByLanguage(simplifiedLocale);

        const formattedModalities = modalities.map((item) => ({
            id: item.id || `id-${Math.random()}`,
            name: item.name || "Modalidade sem nome"
        }));

        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Modalidades e Coberturas</h1>

                <ModalidadeCoberturaIntegration
                    initialModalities={formattedModalities}
                />

                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                        Esta página demonstra o carregamento de modalidades e coberturas feito pelo servidor,
                        eliminando os problemas de "node events" no cliente.
                    </p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
        // Retornar um componente de erro ou dados fallback
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Modalidades e Coberturas</h1>
                <ModalidadeCoberturaIntegration
                    initialModalities={[
                        { id: "garantia-judicial", name: "JUDICIAL GUARANTEE" },
                        { id: "participar-licitacao", name: "PARTICIPATE IN BIDDING" },
                        { id: "execucao-contratos", name: "EXECUTION OF CONTRACTS" }
                    ]}
                />
                {/* Componente de erro */}
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                        Houve um erro ao carregar as modalidades do servidor.
                    </p>
                </div>
            </div>
        );
    }
}
