import {reactRouter} from '@react-router/dev/vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Plugin to handle Node.js built-ins in browser context
const excludeNodeBuiltins = () => ({
  name: 'exclude-node-builtins',
  enforce: 'pre',
  resolveId(id, importer, options) {
    // Skip if we don't have an importer (entry points)
    if (!importer) return null;
    
    // Check if the import is coming from Hydrogen's development files
    const isFromHydrogenDev = importer && importer.includes('@shopify/hydrogen') && importer.includes('/development/');
    
    // Intercept Node.js built-in modules
    const nodeBuiltins = ['url', 'path', 'fs', 'fs/promises', 'node:url', 'node:path', 'node:fs', 'node:fs/promises'];
    
    // If a Hydrogen development file is trying to import Node.js built-ins, stub them out
    if (nodeBuiltins.includes(id) && isFromHydrogenDev) {
      return {
        id: '\0node-builtin:' + id,
        external: false
      };
    }
    
    return null;
  },
  load(id) {
    if (id.startsWith('\0node-builtin:')) {
      // Return stub exports for Node.js built-ins
      const moduleName = id.replace('\0node-builtin:', '');
      return `
        // Stub for ${moduleName}
        export default {};
        export const fileURLToPath = () => '';
        export const readdir = () => Promise.resolve([]);
        export const dirname = () => '';
        export const join = (...args) => args.join('/');
        export const resolve = (...args) => args.join('/');
        export const parse = () => ({});
      `;
    }
  },
});

export default defineConfig(({mode}) => {
  const isDev = mode === 'development';
  
  return {
    optimizeDeps: {
      include: [
        'react-use/esm/useMedia',
        'react-use/esm/useDebounce',
        '@shopify/hydrogen-react',
        'class-variance-authority',
        '@sanity/client/stega',
        'color2k',
        '@sanity/image-url',
        'tailwind-merge',
        'embla-carousel-autoplay',
        '@tanem/react-nprogress',
        '@sanity/asset-utils',
        'embla-carousel-react',
        '@portabletext/react',
        'vaul',
        'motion/react',
        '@shopify/hydrogen-react/Image',
        '@vercel/stega',
        'react-dom/client',
      ],
      exclude: ['@shopify/hydrogen'],
    },
    plugins: [
      excludeNodeBuiltins(),
      hydrogen(),
      ...(isDev ? [oxygen()] : []),
      reactRouter(),
      tsconfigPaths(),
    ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress circular dependency warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
    },
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    conditions: ['browser', 'module', 'import'],
    alias: {
      'hoist-non-react-statics':
        'hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js',
      '@sanity/image-url': '@sanity/image-url/lib/node/index.js',
      '@remix-run/react': 'react-router',
    },
  },
    define: {
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    },
    ssr: {
      target: 'webworker',
      resolve: {
        conditions: ['workerd', 'worker', 'browser'],
        externalConditions: ['workerd', 'worker'],
      },
      optimizeDeps: {
        include: [
          'react-router',
          'react-compiler-runtime',
          '@sanity/image-url',
          '@sanity/client',
          '@tanem/react-nprogress',
        ],
      },
      noExternal: ['@sanity/visual-editing'],
      external: [
        'url',
        'path',
        'fs',
        'fs/promises',
        'node:url',
        'node:path',
        'node:fs',
        'node:fs/promises',
      ],
    },
  };
});
