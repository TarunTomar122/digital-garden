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
};

export default nextConfig;
