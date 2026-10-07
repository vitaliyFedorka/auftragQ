const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    // supabase/functions runs on Deno (its own globals, import style, lint rules) — not this project's ESLint config.
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'supabase/**'],
  },
  {
    rules: {
      'import/order': 'off',
    },
  },
];
