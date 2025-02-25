/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
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
};

export default nextConfig;
