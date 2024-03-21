import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { xt256 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('json', json)

import { memo } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import type { LogMessage } from '@/generated/gql/graphql'
import { colors } from '@/theme/colors'
import { logFetcher } from '@/utils/api'

import { unixTimeToHumanReadable } from '../charts/helpers'

export const MqttLogs = () => {
    const { data, isLoading } = useSWR(
        `{
            logs {
              topic
              payload
              date
            }
          }`,
        logFetcher
    )

    if (isLoading || !data) return null

    return (
        <MqttLogsContainer
            className={'rounded-lg border bg-zinc-950 dark:bg-zinc-900'}
        >
            {data.logs.map((log, index) => (
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
                gap: 12,
                flexDirection: 'column',
                alignItems: 'start',
                justifyContent: 'space-between',
            }}
        >
            <span
                style={{
                    width: 96,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {data.topic.replace('zigbee2mqtt/', '')}
            </span>
            <span>{unixTimeToHumanReadable(data.date as number)}</span>
        </div>
        <SyntaxHighlighter
            language={'json'}
            style={xt256}
            wrapLongLines
            customStyle={{
                fontSize: 13,
                lineHeight: 1.6,
                padding: 0,
                backgroundColor: 'transparent',
                overflow: 'hidden',
            }}
        >
            {data.payload}
        </SyntaxHighlighter>
    </div>
))
