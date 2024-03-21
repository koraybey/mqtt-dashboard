module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2020: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:unicorn/recommended',
        'plugin:prettier/recommended',
        'plugin:functional/external-vanilla-recommended',
        'plugin:functional/no-other-paradigms',
        'plugin:functional/stylistic',
        'plugin:functional/disable-type-checked',
    ],
    plugins: [
        'functional',
        'simple-import-sort',
        'react',
        'react-hooks',
        'react-refresh',
    ],
    rules: {
        'functional/no-mixed-type': 'off',
        'unicorn/prefer-node-protocol': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-null': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'prefer-template': 'error',
        'no-console': 'error',
        'object-shorthand': 'error',
        'simple-import-sort/imports': 'error',
        eqeqeq: ['error', 'smart'],
        quotes: ['error', 'single', { avoidEscape: true }],
        'react/jsx-curly-brace-presence': [
            'error',
            { props: 'always', children: 'never' },
        ],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react/display-name': 'off',
        'react/jsx-no-bind': 'warn',
        'react-hooks/exhaustive-deps': 'error',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:functional/external-typescript-recommended',
            ],
            parserOptions: {
                project: true,
            },
            rules: {
                '@typescript-eslint/consistent-type-imports': 'error',
                '@typescript-eslint/no-extra-semi': 'off',
                '@typescript-eslint/prefer-readonly-parameter-types': 'off',
                '@typescript-eslint/unbound-method': 'off',
                '@typescript-eslint/require-await': 'off',
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        varsIgnorePattern: '^_',
                        argsIgnorePattern: '^_',
                        caughtErrorsIgnorePattern: '^_',
                    },
                ],
            },
        },
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
}
