module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', '.next/', '.expo/', 'build/'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
    },
  ],
};
