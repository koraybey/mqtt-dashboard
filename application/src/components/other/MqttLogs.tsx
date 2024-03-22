import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { xt256 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('json', json)

import * as R from 'ramda'
import { memo } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import type { LogMessage } from '@/generated/gql/graphql'
import { colors } from '@/theme/colors'
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
        <MqttLogsContainer
            className={'rounded-lg border bg-zinc-950 dark:bg-zinc-900'}
        >
            {R.prop('logs', data).map((log, index) => (
                <MqttLogsMessage data={log} key={index} />
            ))}
        </MqttLogsContainer>
    )
}

const MqttLogsContainer = styled.div`
    height: 100%;
    padding: 12px;
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
            paddingBottom: 12,
        }}
    >
        <div
            style={{
                fontSize: 13,
                color: colors.shade[8],
                marginRight: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                flexShrink: 0,
                width: 96,
                justifyContent: 'space-between',
                gap: 4,
            }}
        >
            <span
                style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    width: 96,
                }}
            >
                {data.friendlyName?.replace('zigbee2mqtt/', '')}
            </span>
            <span
                style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    width: 96,
                }}
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
