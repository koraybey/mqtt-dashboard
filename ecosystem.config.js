// eslint-disable-next-line unicorn/prefer-module
module.exports = {
    apps: [
        {
            name: 'frontend:start',
            script: 'yarn workspace application start',
        },
        {
            name: 'server:start',
            script: 'yarn workspace server start',
        },
    ],
}
