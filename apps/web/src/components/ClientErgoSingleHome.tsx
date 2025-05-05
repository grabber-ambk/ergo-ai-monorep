'use client';

import dynamic from 'next/dynamic';

const ErgoSingleHome = dynamic(() => import('./ErgoSingleHome'), {
    loading: () => <div>Carregando...</div>
});

export default function ClientErgoSingleHome() {
    return <ErgoSingleHome />;
}
