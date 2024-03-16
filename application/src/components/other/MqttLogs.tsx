import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { xt256 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('json', json)

import { useEffect, useRef } from 'react'

import { colors } from '@/theme/colors'
import { useMqttStore } from '@/utils/mqtt'

import { isoToHumanReadableTimestamp } from '../charts/helpers'

export const MqttLogs = () => {
    //! TODO Add connecting, error and reconnecting states to display client status
    const logs = useMqttStore((state) => state.logs)
    const scrollToBottomRef = useRef<HTMLDivElement>(null)

    const scrollToBottomCalc =
        (scrollToBottomRef?.current?.scrollHeight || 0) -
        (scrollToBottomRef?.current?.clientHeight || 0)

    useEffect(() => {
        scrollToBottomRef?.current?.scrollTo(0, scrollToBottomCalc)
    }, [scrollToBottomCalc, logs])

    return (
        <div
            style={{
                justifyContent: 'space-between',
                position: 'relative',
                height: '100%',
                padding: 8,
                overflow: 'auto',
            }}
            ref={scrollToBottomRef}
        >
            {logs.map((log, index) => {
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
                                {isoToHumanReadableTimestamp(log.timestamp)}
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
                            {log.message}
                        </SyntaxHighlighter>
                    </div>
                )
            })}
            <div ref={scrollToBottomRef} />
        </div>
    )
}
