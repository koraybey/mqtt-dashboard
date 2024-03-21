// eslint-disable-next-line unicorn/prefer-module
module.exports = {
    apps: [
        {
            name: 'frontend',
            script: 'pnpm application dev',
        },
        {
            name: 'mqtt_logger',
            script: 'pnpm database start:logger',
        },
        {
            name: 'gql_server',
            script: 'pnpm database start:graphql',
        },
    ],
}
