/* eslint-disable */
const nextConfig = {
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
