/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        ppr: true,
        useCache: true,
    },
};

export default nextConfig;
