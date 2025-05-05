// packages/ui/src/utils/lucide-config.tsx
'use client';

import { createContext } from 'react';
import { LucideProps } from 'lucide-react';

// Criar um contexto do Lucide com configurações personalizadas
export const LucideContext = createContext<{
    defaultProps?: Partial<LucideProps>;
}>({
    defaultProps: {
        // A propriedade correta é className, não cssClass
        className: '',
        strokeWidth: 2,
    },
});

// Componente provider para usar no nível superior da sua aplicação
export function LucideProvider({ children }: { children: React.ReactNode }) {
    return (
        <LucideContext.Provider
            value={{
                defaultProps: {
                    className: '', // Corrigido aqui também
                    strokeWidth: 2,
                },
            }}
        >
            {children}
        </LucideContext.Provider>
    );
}
