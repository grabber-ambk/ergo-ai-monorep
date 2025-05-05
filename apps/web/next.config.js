/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    experimental: {
        serverActions: {
            // Você pode adicionar opções de configuração aqui se necessário
            allowedOrigins: ['localhost:3000'],
            bodySizeLimit: '2mb'
        }
    },
    transpilePackages: [
        '@ergo-ai/hooks',
        '@ergo-ai/ui',
        '@ergo-ai/i18n',
        '@ergo-ai/api-client',
        '@ergo-ai/features'
    ],
    images: {
        domains: ['@ergo-ai'],
    },

    async rewrites() {
        return [
            // Rewrite everything to `pages/index`
            {
                source: '/:locale',
                destination: '/:locale',
            },
        ];
    },
    webpack(config) {
        // For PDF.js
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;

        return config;
    },
};

module.exports = nextConfig;
