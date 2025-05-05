/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    experimental: {
        // Updated from serverActions: true to the newer API
        serverActions: {
            allowedOrigins: ['localhost:3000', 'localhost:3002']
        }
        // Removed serverComponents as it's now default in Next.js 15
    },
    images: {
        domains: ['ergo.ai'],
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

export default nextConfig;
