//packages/ui/src/ModalitySelectionWrapper.tsx
'use client'

import { useState, useEffect } from 'react';
import ModalitySelectionOriginal from '../ModalitySelectionOriginal';
import { useLocale } from '@ergo-ai/i18n';

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isDisabled?: boolean;
    initialModalities?: any[];
}

export default function ModalitySelectionWrapper({
                                                     value,
                                                     onChange,
                                                     isDisabled = false,
                                                     initialModalities
                                                 }: Props) {
    const { locale } = useLocale();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (isClient && initialModalities) {
        return (
            <ModalitySelectionOriginal
                value={value}
                onChange={onChange}
                isDisabled={isDisabled}
                preloadedModalities={initialModalities}
                usePreloadedData={true}
            />
        );
    }

    return isClient ? (
        <ModalitySelectionOriginal
            value={value}
            onChange={onChange}
            isDisabled={isDisabled}
        />
    ) : null;
}
