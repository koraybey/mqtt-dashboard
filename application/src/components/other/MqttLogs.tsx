import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { xt256 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('json', json)

import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

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

    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    const scrollToBottomCalc =
        (scrollToBottomRef?.current?.scrollHeight || 0) -
        (scrollToBottomRef?.current?.clientHeight || 0)

    useEffect(() => {
        if (isLoading || !data) return
        scrollToBottomRef?.current?.scrollTo(0, scrollToBottomCalc)
    }, [scrollToBottomCalc, isLoading, data])

    if (isLoading || !data) return null

    return (
        <MqttLogsContainer ref={scrollToBottomRef}>
            {data.logs.map((log, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'start',
                            paddingBottom: 8,
                            paddingTop: 8,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 13,
                                color: colors.shade[8],
                                marginRight: 12,
                                display: 'flex',
                                gap: 8,
                                flexDirection: 'column',
                                alignItems: 'start',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span
                                style={{
                                    maxWidth: 96,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {log.topic.replace('zigbee2mqtt/', '')}
                            </span>
                            <span>
                                {unixTimeToHumanReadable(log.date as number)}
                            </span>
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
                            {log.payload}
                        </SyntaxHighlighter>
                    </div>
                )
            })}
            <div ref={scrollToBottomRef} />
        </MqttLogsContainer>
    )
}

const MqttLogsContainer = styled.div`
    height: 100%;
    padding: 8px;
    justify-content: space-between;
    position: relative;
    overflow: auto;
`
