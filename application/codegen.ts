import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: 'http://10.147.17.93:4000/graphql',
    generates: {
        'src/generated/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
}

export default config
