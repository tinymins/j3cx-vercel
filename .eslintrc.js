// http://eslint.org/docs/user-guide/configuring

const importResolverExtensions = [
  '.js',
  '.jsx',
  '.jx',
  '.ts',
  '.tsx',
  '.tx',
];

const javascriptRules = {
  'no-new-func': 'off',
  'node/no-unpublished-import': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/no-array-for-each': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/prefer-switch': 'off',
};

const typescriptRules = {
  ...javascriptRules,
};

const buildingToolsJavascriptRules = {
  camelcase: 'off',
  'id-match': 'off',
  'multiline-comment-style': 'off',
  'no-console': 'off',
  'no-sync': 'off',
  'no-underscore-dangle': 'off',
  'node/global-require': 'off',
  'node/no-unpublished-require': 'off',
  'unicorn/prefer-module': 'off',
};

const buildingToolsTypescriptRules = {
  ...buildingToolsJavascriptRules,
  '@typescript-eslint/naming-convention': 'off',
};

// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      modules: true,
      jsx: true,
      legacyDecorators: true,
    },
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    'import',
    'json',
    'unicorn',
    'unused-imports',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: importResolverExtensions,
      },
      typescript: {},
      webpack: {
        config: 'webpack.config.js',
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.tx'],
    },
  },
  noInlineConfig: true,
  overrides: [
    // ----------------------
    //  json files
    // ----------------------
    {
      files: ['.json', '.*.json'],
      extends: ['lvmcn/json'],
    },
    // ----------------------
    //  building tools files
    // ----------------------
    {
      files: ['*.js', '.*.js'],
      excludedFiles: ['api/**'],
      extends: ['lvmcn/javascript/node'],
      rules: buildingToolsJavascriptRules,
    },
    {
      files: ['*.ts', '.*.ts', '*.tsx', '.*.tsx'],
      excludedFiles: ['api/**'],
      extends: ['lvmcn/typescript/node'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          modules: true,
          jsx: true,
          legacyDecorators: true,
        },
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: buildingToolsTypescriptRules,
    },
    // ----------------------
    //  project source files
    // ----------------------
    {
      files: ['api/**/*.js', 'api/**/*.jsx'],
      extends: ['lvmcn/javascript/node'],
      rules: javascriptRules,
    },
    {
      files: ['api/**/*.ts', 'api/**/*.tsx', 'api/**/*.tx'],
      extends: ['lvmcn/typescript/node'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          modules: true,
          jsx: true,
          legacyDecorators: true,
        },
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: typescriptRules,
    },
    // d.ts
    {
      files: ['api/**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    // utils
    {
      files: ['api/utils/*.ts'],
      rules: {},
    },
    // utils logger
    {
      files: ['api/utils/logger.ts'],
      rules: { 'no-console': 'off' },
    },
    // store services
    {
      files: [
        'api/store/services/**/*.ts',
        'api/store/services/**/*.tsx',
      ],
      rules: {
        'unicorn/filename-case': 'off',
        'unicorn/no-array-for-each': 'off',
        '@typescript-eslint/no-redeclare': 'off',
      },
    },
  ],
};
