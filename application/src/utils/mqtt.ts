import type { Message, MQTTError } from 'paho-mqtt'
import Paho from 'paho-mqtt'
import { useEffect } from 'react'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import type { ParsedMessage } from '@/types/exposes'

const mqttBrokerURL = import.meta.env.VITE_MQTT_BROKER_URL
const mqttBrokerPort = import.meta.env.VITE_MQTT_BROKER_PORT

if (!mqttBrokerURL || !mqttBrokerPort) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('MQTT_BROKER_URL and MQTT_PORT must be set')
}

const client = new Paho.Client(
    mqttBrokerURL,
    Number(mqttBrokerPort),
    `mqttjs_${Math.random().toString(16).slice(2, 10)}`
)

type MqttStore = {
    isConnected: boolean | undefined
    deviceStatus: { [key: string]: string }[]
    updateDeviceStatus: (topic: string, status: boolean | undefined) => void
}

export const useMqttStore = create<MqttStore>()(
    devtools(
        persist(
            (set) => ({
                logs: [],
                isConnected: undefined,
                deviceStatus: [],
                updateDeviceStatus: (topic, status) =>
                    set((state) => ({
                        deviceStatus: {
                            ...state.deviceStatus,
                            [topic]: { status },
                        },
                    })),
            }),
            {
                name: 'mqtt-storage',
                storage: createJSONStorage(() => sessionStorage),
                partialize: (state) =>
                    Object.fromEntries(
                        Object.entries(state).filter(
                            ([key]) =>
                                !['isConnected', 'deviceStatus'].includes(key)
                        )
                    ),
            }
        )
    )
)

client.connect({
    onSuccess: () => {
        useMqttStore.setState({ isConnected: true })
    },
    onFailure: () => {
        return new Error('Cannot connect to MQTT Broker.')
    },
    keepAliveInterval: 30,
    reconnect: true,
})

export const useMqttSubscribe = (topic: string) => {
    const isConnected = useMqttStore((state) => state.isConnected)
    useEffect(() => {
        if (!isConnected) return
        client.subscribe(topic, { qos: 0 })
    }, [topic, isConnected])
}

export const mqttPublish = (topic: string, payload: string) => {
    const message = new Paho.Message(payload)
    message.destinationName = topic
    client.send(message)
}

const determineState = (parsedMessage: ParsedMessage, topic: string) => {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (true) {
        case topic.includes('plug'): {
            return parsedMessage.state === 'ON' ? true : false
        }
        case topic.includes('light'): {
            return parsedMessage.state === 'ON' ? true : false
        }
        case topic.includes('contact'): {
            return !parsedMessage.contact
        }
        case topic.includes('motion'): {
            return parsedMessage.occupancy
        }
    }
}

const onHandleMessage = (message: Message) => {
    const parsedMessage = JSON.parse(message.payloadString) as ParsedMessage
    useMqttStore
        .getState()
        .updateDeviceStatus(
            message.destinationName,
            determineState(parsedMessage, message.destinationName)
        )
}

const onConnectionLost = (responseObject: MQTTError) => {
    if (responseObject.errorCode !== 0) {
        return new Error('Lost MQTT connection')
    }
}

client.onConnectionLost = onConnectionLost
client.onMessageArrived = onHandleMessage
