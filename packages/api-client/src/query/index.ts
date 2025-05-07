// packages/api-client/src/query/index.ts
// Exportar o cliente para o navegador com um nome específico
export { queryClient as browserQueryClient } from './browser-client';
// Exportar o cliente completo para uso no servidor
export * from './client';
