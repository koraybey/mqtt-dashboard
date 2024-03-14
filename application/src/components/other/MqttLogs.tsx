import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { qtcreatorDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('json', json)

import { colors } from '@/theme/colors'
import { useMqttStore } from '@/utils/mqtt'

export const MqttLogs = () => {
    //! TODO Add connecting, error and reconnecting states to display client status
    const logs = useMqttStore((state) => state.logs)
    return (
        <div
            style={{
                height: '100%',
                overflow: 'scroll',
                padding: 8,
            }}
        >
            {logs.map((log, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: 4,
                            paddingTop: 4,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 13,
                                backgroundColor: colors.shade[13],
                                color: colors.shade[3],
                                padding: 8,
                                borderRadius: 8,
                                marginRight: 4,
                                fontStyle: 'italic',
                            }}
                        >
                            {log.topic.replace('zigbee2mqtt/', '')}
                        </div>
                        <SyntaxHighlighter
                            language={'json'}
                            style={qtcreatorDark}
                            wrapLongLines
                            customStyle={{
                                fontSize: 13,
                                lineHeight: 1.6,
                                backgroundColor: 'transparent',
                                overflow: 'hidden',
                            }}
                        >
                            {log.message}
                        </SyntaxHighlighter>
                    </div>
                )
            })}
        </div>
    )
}
