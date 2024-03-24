import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { xt256 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('json', json)

import * as R from 'ramda'
import { memo } from 'react'
import useSWR from 'swr'

import type { LogMessage } from '@/generated/gql/graphql'
import { fetcher } from '@/utils/api'

import { isoToHumanReadable } from '../charts/helpers'

export const MqttLogs = () => {
    const { data, isLoading } = useSWR<{ logs: LogMessage[] }>(
        `{
            logs {
              friendlyName
              current
              energy
              power
              lastSeen
              voltage
              linkquality
              state
              contact
              occupancy
              battery
              illuminance
              deviceTemperature
              powerOutageCount
              timestamp
            }
          }`,
        fetcher
    )

    if (isLoading || !data) return null

    return R.prop('logs', data)
        .slice(0, 20)
        .map((log, index) => <MqttLogsMessage data={log} key={index} />)
}

export const MqttLogsMessage = memo(({ data }: { data: LogMessage }) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            gap: 12,
            fontSize: 14,
        }}
    >
        <span
            className={
                'whitespace-nowrap overflow-ellipsis tracking-wide dark:text-zinc-400'
            }
        >
            {isoToHumanReadable(data.timestamp)}
        </span>
        <SyntaxHighlighter
            language={'json'}
            style={xt256}
            wrapLines
            lineProps={{
                style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
            }}
            customStyle={{
                fontSize: 13,
                lineHeight: 1.8,
                padding: 0,
                backgroundColor: 'transparent',
                overflow: 'hidden',
            }}
        >
            {JSON.stringify(data, null, 0)}
        </SyntaxHighlighter>
    </div>
))
