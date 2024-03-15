// eslint-disable-next-line unicorn/prefer-module
module.exports = {
    apps: [
        {
            name: 'application',
            script: 'server.js',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
}
