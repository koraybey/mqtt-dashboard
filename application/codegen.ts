import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'

dotenv.config()

const graphqlURL = process.env.VITE_GRAPHQL_URL

if (!graphqlURL) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('VITE_GRAPHQL_URL must be set')
}

const config: CodegenConfig = {
    overwrite: true,
    schema: graphqlURL,
    generates: {
        'src/generated/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
}

export default config
