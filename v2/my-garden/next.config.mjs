/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure compiler options for production optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        ppr: true,
        useCache: true,
    },
    // Configure page caching
    staticPageGenerationTimeout: 120,
    
    // Configure revalidation intervals for ISR
    revalidate: 3600, // 1 hour

    // Configure allowed image domains
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-na.ssl-images-amazon.com',
                pathname: '/images/S/**',
            },
            {
                protocol: 'https',
                hostname: 'th.bing.com',
                pathname: '/th/**',
            },
            {
                protocol: 'https',
                hostname: 'private-user-images.githubusercontent.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
