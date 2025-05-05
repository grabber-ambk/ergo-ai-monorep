// apps/web/src/app/providers.tsx
"use client";

import { queryClient } from "@ergo-ai/api-client";
import { QueryClientProvider } from "@tanstack/react-query";


export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
