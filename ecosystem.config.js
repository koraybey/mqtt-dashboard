// eslint-disable-next-line unicorn/prefer-module
module.exports = {
    apps: [
        {
            name: 'frontend',
            script: 'cd application && NODE_ENV=production node server.js',
        },
        {
            name: 'server',
            script: 'cd server && node api.js',
        },
        {
            name: 'mqtt_logger',
            script: 'cd database && cargo run --bin mqtt_logger',
        },
        {
            name: 'gql_server',
            script: 'cd database && cargo run --bin gql_server',
        },
    ],
}
