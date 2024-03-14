module.exports = {
    env: {
        browser: true,
        es2020: true,
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                '../.eslintrc.cjs',
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
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    plugins: ['react', 'react-hooks', 'react-refresh'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react/display-name': 'off',
        'react/jsx-no-bind': 'warn',
        'react-hooks/exhaustive-deps': 'error',
        'unicorn/prefer-node-protocol': 'off',
        'functional/no-mixed-type': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-null': 'off',
        'react/jsx-curly-brace-presence': [
            'error',
            { props: 'always', children: 'never' },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}
