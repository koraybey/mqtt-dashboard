/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MQTT_BROKER_PORT: string | undefined
    readonly VITE_MQTT_BROKER_URL: string | undefined
    readonly VITE_STREAM_URL: string | undefined
    readonly VITE_GRAPHQL_URL: string | undefined
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
