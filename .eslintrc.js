module.exports = {
    env: {
        node: true
    },
    
    // JS settings
    parser: 'babel-eslint',
    extends: ['eslint:recommended'],

    // TS settings
    overrides: [{
        files: ['*.ts', '*.tsx'],
        parser: '@typescript-eslint/parser',
        plugins: [
            '@typescript-eslint',
        ],
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:react/recommended',
            'prettier/@typescript-eslint',
            'plugin:prettier/recommended',
        ],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/camelcase': 'off',
            '@typescript-eslint/semi': 'warn',
        },
    }],

    settings: {
        react: {
            version: "detect",
        },
    },
};
