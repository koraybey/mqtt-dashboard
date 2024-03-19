import { formatISO } from 'date-fns'
import type { Message, MQTTError } from 'paho-mqtt'
import Paho from 'paho-mqtt'
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import { useEffect } from 'react'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import type { ParsedMessage } from '@/types/exposes'

const client = new Paho.Client(
    'dashboard.perseus.digital', // Overlay network IP
    Number(1881),
    `mqttjs_${Math.random().toString(16).slice(2, 10)}`
)

client.onConnectionLost = onConnectionLost
client.onMessageArrived = onHandleMessage

type MqttLog = {
    topic: string
    message: string
    timestamp: string
}

type MqttStore = {
    logs: MqttLog[]
    isConnected: boolean
    deviceStatus: { [key: string]: string }[]
    addMessageToLogs: (log: MqttLog) => void
    updateDeviceStatus: (topic: string, status: boolean) => void
}

export const useMqttStore = create<MqttStore>()(
    devtools(
        persist(
            (set) => ({
                logs: [],
                isConnected: false,
                deviceStatus: [],
                addMessageToLogs: (log) =>
                    set((state) => ({
                        logs: [
                            ...state.logs,
                            {
                                topic: log.topic,
                                message: log.message,
                                timestamp: log.timestamp,
                            },
                        ],
                    })),
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
        throw new Error('Cannot connect to MQTT Broker.')
    },
    keepAliveInterval: 120,
    reconnect: true,
})

export function useMqttSubscribe(topic: string) {
    const isConnected = useMqttStore((state) => state.isConnected)
    useEffect(() => {
        if (!isConnected) return
        client.subscribe(topic, { qos: 1 })
    }, [topic, isConnected])
}

export function mqttPublish(topic: string, payload: string) {
    const message = new Paho.Message(payload)
    message.destinationName = topic
    client.send(message)
}

function onHandleMessage(message: Message) {
    const parsedMessage = JSON.parse(message.payloadString) as ParsedMessage
    const log = {
        topic: message.destinationName,
        message: message.payloadString,
        timestamp: formatISO(new Date()).toString(),
    }
    useMqttStore.getState().addMessageToLogs(log)
    switch (message.destinationName) {
        case 'zigbee2mqtt/0_light_studio': {
            if (RA.isNilOrEmpty(parsedMessage.state)) {
                return
            }
            useMqttStore
                .getState()
                .updateDeviceStatus(
                    message.destinationName,
                    parsedMessage.state === 'ON' ? true : false
                )
            break
        }
        case 'zigbee2mqtt/0_plug_studio': {
            if (RA.isNilOrEmpty(parsedMessage.state)) {
                return
            }
            useMqttStore
                .getState()
                .updateDeviceStatus(
                    message.destinationName,
                    parsedMessage.state === 'ON' ? true : false
                )
            break
        }
        case 'zigbee2mqtt/0_contact_balcony': {
            if (R.isNil(parsedMessage.contact)) {
                return
            }
            useMqttStore
                .getState()
                .updateDeviceStatus(
                    message.destinationName,
                    !parsedMessage.contact
                )
            break
        }
        case 'zigbee2mqtt/0_contact_door': {
            if (R.isNil(parsedMessage.contact)) {
                return
            }
            useMqttStore
                .getState()
                .updateDeviceStatus(
                    message.destinationName,
                    !parsedMessage.contact
                )
            break
        }
    }
}

function onConnectionLost(responseObject: MQTTError) {
    if (responseObject.errorCode !== 0) {
        throw new Error('Lost MQTT connection')
    }
}
