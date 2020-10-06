module.exports = {
  env: {
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['jest', '@typescript-eslint'],
  rules: {
    'max-len': ['error', { code: 100 }],
    'import/extensions': ['error', { ts: 'never' }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
