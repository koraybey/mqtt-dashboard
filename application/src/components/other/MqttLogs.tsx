import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { xt256 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('json', json)

import * as R from 'ramda'
import { memo } from 'react'
import styled from 'styled-components'
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

    return (
        <MqttLogsContainer className={'rounded-lg border dark:bg-zinc-950'}>
            {R.prop('logs', data).map((log, index) => (
                <MqttLogsMessage data={log} key={index} />
            ))}
        </MqttLogsContainer>
    )
}

const MqttLogsContainer = styled.div`
    height: 100%;
    padding: 16px;
    justify-content: space-between;
    position: relative;
    overflow: auto;
`

export const MqttLogsMessage = memo(({ data }: { data: LogMessage }) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            paddingBottom: 16,
        }}
    >
        <div
            style={{
                fontSize: 13,
                marginRight: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                flexShrink: 0,
                justifyContent: 'space-between',
                gap: 4,
            }}
        >
            <span
                className={
                    'whitespace-nowrap overflow-ellipsis tracking-wide dark:text-zinc-500'
                }
            >
                {isoToHumanReadable(data.timestamp)}
            </span>
        </div>
        <SyntaxHighlighter
            language={'json'}
            style={xt256}
            wrapLines
            lineProps={{
                style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
            }}
            customStyle={{
                fontSize: 13,
                lineHeight: 1.6,
                padding: 0,
                backgroundColor: 'transparent',
                overflow: 'hidden',
            }}
        >
            {JSON.stringify(data, null, 0)}
        </SyntaxHighlighter>
    </div>
))
