const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resetCache: process.env.RESET_CACHE === 'true',
};

// Disable watch mode for release builds to avoid Windows file watcher issues
// Watch mode is only needed for development
const isCI = process.env.CI === 'true' || process.env.NODE_ENV === 'production';

if (isCI) {
  // Disable watcher completely for CI/release builds
  config.watcher = {
    watchman: {
      deferStates: ['hg.update'],
    },
    healthCheck: {
      enabled: false,
    },
    // Disable file watching completely
    additionalExts: [],
  };
  
  // Use a more reliable resolver for CI
  config.resolver = {
    ...getDefaultConfig(__dirname).resolver,
    // Disable file watching
    unstable_enableSymlinks: false,
  };
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
