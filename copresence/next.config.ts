/* eslint-disable */
const nextConfig = {
  async redirects() {
    return [
      { source: "/experience", destination: "/resume", permanent: true },
      { source: "/writings/smollms", destination: "/projects/smollms", permanent: true },
      {
        source: "/writings/youtube-shorts-pipeline-ai",
        destination: "/projects/youtube-shorts-pipeline-ai",
        permanent: true,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Use webpack instead of Turbopack for @xenova/transformers compatibility
  webpack: (config, { isServer }) => {
    // Fixes for @xenova/transformers
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
    };
    
    // Add fallbacks for node modules not available in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
