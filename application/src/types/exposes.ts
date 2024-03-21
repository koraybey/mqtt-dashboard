type StringState = 'ON' | 'OFF'

export interface SharedExposes {
    time: string
    identifier: string // Device name
    battery: number // Remaining battery (%)
    device_temperature: number // (°C)
    linkquality: number // Signal strength (lqi)
    voltage: number // Battery voltage (mV)
    power_outage_count: number // Power outage count
}

export type DeviceInformation = {
    name: string
    type: string
}

export interface Devices {
    [key: string]: DeviceInformation
}

// https://www.zigbee2mqtt.io/devices/MCCGQ12LM.html
export interface ContactExposes extends SharedExposes {
    contact: boolean // Indicates contact state
}

// https://www.zigbee2mqtt.io/devices/RTCGQ11LM.html
export interface MotionExposes extends SharedExposes {
    occupancy: boolean // Indicates occupancy state
    illuminance: number // Measured illuminance (lux)
}

// https://www.zigbee2mqtt.io/devices/A1Z.html#nous-a1z
export interface PlugExposes extends SharedExposes {
    current: number // Instantaneous measured electrical current (Ampere)
    energy: number // Measured electrical potential value
    power: number // Instantaneous measured electrical current (Watt)
    state: StringState // Zigbee2MQTT uses string to indicate device state.
}

export type ParsedMessage = {
    state?: StringState
    contact?: boolean
}

export type LogMessage = {
    topic: string
    payload: string
    date: number
}

export type DeviceList = {
    topic: string
    payload: string
    date: number
}

export type Exposes = ContactExposes | PlugExposes | MotionExposes
