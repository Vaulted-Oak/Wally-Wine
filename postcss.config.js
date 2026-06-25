/* eslint perfectionist/sort-objects: 0 */
export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-preset-env': {
      features: {'nesting-rules': false},
    },
  },
};
