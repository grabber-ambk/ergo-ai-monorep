//packages/ui/src/utils/ClientOnlyIcon.tsx

'use client'

import React, { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyIconProps {
    children: ReactNode;
    className?: string;
    placeholder?: React.ReactNode;
    width?: string | number;
    height?: string | number;
}

/**
 * Um componente wrapper que renderiza seu conteúdo apenas no lado do cliente.
 * Útil para evitar erros de hidratação com componentes SVG como ícones do Lucide.
 *
 * @param children O conteúdo que será renderizado apenas no cliente
 * @param className Classes opcionais para o wrapper
 * @param placeholder Elemento opcional para mostrar durante a renderização do servidor
 * @param width Largura opcional do placeholder (padrão: 24px)
 * @param height Altura opcional do placeholder (padrão: 24px)
 */
export const ClientOnlyIcon: React.FC<ClientOnlyIconProps> = ({
                                                                  children,
                                                                  className = '',
                                                                  placeholder,
                                                                  width = '24px',
                                                                  height = '24px',
                                                              }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Se um placeholder personalizado foi fornecido, use-o
        if (placeholder) {
            return <>{placeholder}</>;
        }

        // Caso contrário, renderize um espaço em branco com as dimensões especificadas
        return (
            <span
                className={className}
                style={{
                    display: 'inline-block',
                    width,
                    height
                }}
            />
        );
    }

    // No cliente, renderize o conteúdo real
    return <>{children}</>;
};

export default ClientOnlyIcon;
