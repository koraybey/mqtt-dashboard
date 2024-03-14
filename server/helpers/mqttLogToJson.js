import fs from 'node:fs'

const DATE_MATCH_PATTERN = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
const IDENTIFIER_MATCH_PATTERN = /'zigbee2mqtt\/(.*?)'/
const JSON_MATCH_PATTERN = /{(.*?)}/

const logSourceUrl = new URL('../static/log.txt', import.meta.url)
const logDestinationUrl = new URL('../static/log_data.json', import.meta.url)

export function mqttToJson(lines) {
    const now = new Date()
    now.setDate(now.getDate() - 30)
    const data = []
    for (let index = 0; index < lines.length - 1; ++index) {
        console.log(lines[index])
        try {
            const time = new Date(lines[index].match(DATE_MATCH_PATTERN)[1])
            if (time < now) continue
            const payload = JSON.parse(
                lines[index].match(JSON_MATCH_PATTERN)[0]
            )
            const identifier = lines[index].match(IDENTIFIER_MATCH_PATTERN)[1]
            const payloadwithTimestamp = {
                ...payload,
                time: time.toISOString(),
                identifier,
            }
            console.error(payloadwithTimestamp)
            data.push(payloadwithTimestamp)
        } catch (error) {
            console.error('Error parsing JSON:', error, 'Line:', lines[index])
            continue
        }
    }
    return data
}
const lines = fs.readFileSync(logSourceUrl, 'utf8').split('\n')
const logData = JSON.stringify(mqttToJson(lines))
fs.writeFileSync(logDestinationUrl, logData)
