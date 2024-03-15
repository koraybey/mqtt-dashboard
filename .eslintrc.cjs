module.exports = {
    root: true,
    env: { node: true },
    plugins: ['functional', 'simple-import-sort'],
    extends: [
        'eslint:recommended',
        'plugin:unicorn/recommended',
        'plugin:prettier/recommended',
        'plugin:functional/external-vanilla-recommended',
        'plugin:functional/no-other-paradigms',
        'plugin:functional/stylistic',
        'plugin:functional/disable-type-checked',
    ],
    rules: {
        'unicorn/filename-case': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'prefer-template': 'error',
        'no-console': 'error',
        'object-shorthand': 'error',
        'simple-import-sort/imports': 'error',
        eqeqeq: ['error', 'smart'],
        quotes: ['error', 'single', { avoidEscape: true }],
    },
}