// packages/api-client/src/query/browser-client.ts

import { QueryClient } from '@tanstack/react-query';

/**
 * Versão do cliente React Query segura para o navegador
 * Não importa nenhuma dependência que exija módulos Node.js
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            retry: 1,
        },
    },
});


