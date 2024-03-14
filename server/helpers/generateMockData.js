import fs from 'node:fs'

import { faker } from '@faker-js/faker'

export function generateHourlyData(deviceType) {
    const data = []

    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            if (deviceType === 'contact') {
                const contactDevice = {
                    identifier: deviceType,
                    battery: 77,
                    device_temperature: faker.number.int({ min: 20, max: 34 }),
                    linkquality: faker.number.int({ min: 90, max: 120 }),
                    voltage: faker.number.int({ min: 2800, max: 2999 }),
                    power_outage_count: faker.number.int({ min: 0, max: 6 }),
                    contact: faker.datatype.boolean(),
                    time: faker.date.between({
                        from: '2024-03-01T00:00:00.000Z',
                        to: '2024-03-07T23:59:59.000Z',
                    }),
                }
                console.log(contactDevice)
                data.push(contactDevice)
            } else if (deviceType === 'motion') {
                const motionDevice = {
                    identifier: deviceType,
                    battery: 80,
                    device_temperature: faker.number.int({ min: 20, max: 34 }),
                    linkquality: faker.number.int({ min: 0, max: 255 }),
                    voltage: faker.number.int({ min: 2800, max: 2999 }),
                    power_outage_count: faker.number.int({ min: 0, max: 6 }),
                    occupancy: faker.datatype.boolean(),
                    illuminance: faker.number.int({ min: 0, max: 100_000 }),
                    time: faker.date.between({
                        from: '2024-03-01T00:00:00.000Z',
                        to: '2024-03-07T23:59:59.000Z',
                    }),
                }
                console.log(motionDevice)
                data.push(motionDevice)
            }
        }
    }
    return data
}

const dataDestionationUrl = (name) =>
    new URL(`../static/log_${name}.json`, import.meta.url)
const contactLogDestinationUrl = dataDestionationUrl('contact')
const motionLogDestinationUrl = dataDestionationUrl('motion')

const encodeJson = (obj) => new TextEncoder('utf8').encode(JSON.stringify(obj))
const contactData = encodeJson(generateHourlyData('contact'))
const motionData = encodeJson(generateHourlyData('motion'))

fs.writeFileSync(contactLogDestinationUrl, contactData)
fs.writeFileSync(motionLogDestinationUrl, motionData)
