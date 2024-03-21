import { animated, useSpring } from '@react-spring/web'
import * as R from 'ramda'
import { useCallback, useEffect } from 'react'

import { colors } from '@/theme/colors'
import { mqttPublish, useMqttStore, useMqttSubscribe } from '@/utils/mqtt'

export const MqttControl = ({
    topic,
    name,
    type,
}: {
    [key: string]: string
}) => {
    useMqttSubscribe(topic)
    const deviceStatus = useMqttStore((state) =>
        R.path([topic, 'status'])(state.deviceStatus)
    )

    const handleClick = useCallback(() => {
        if (type === ('sensor' || 'contact')) return
        const payload = { state: deviceStatus ? 'OFF' : 'ON' }
        mqttPublish(`${topic}/set`, JSON.stringify(payload))
    }, [deviceStatus, topic, type])

    const [background, api] = useSpring(() => ({
        bg: 'rgba(255,255,255,0.04)',
    }))

    useEffect(() => {
        void api.start({
            bg: deviceStatus ? '#d8a200' : 'rgba(255,255,255,0.06)',
        })
    }, [api, deviceStatus, topic])

    return (
        <div
            style={{
                position: 'relative',
                minHeight: 150,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    pointerEvents: 'none',
                }}
            >
                <h3>{name}</h3>
                <Icon type={type} deviceStatus={deviceStatus as boolean} />
            </div>
            <animated.button
                onClick={handleClick}
                style={{
                    backgroundColor: background.bg,
                    width: '100%',
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    overflow: 'hidden',
                }}
            ></animated.button>
        </div>
    )
}

//! TODO Refactor
const Icon = ({
    type,
    deviceStatus,
}: {
    type: string
    deviceStatus: boolean
}) => {
    switch (type) {
        case 'sensor': {
            return (
                <i
                    className={'iconoir-contactless'}
                    style={{
                        fontSize: 24,
                        color: deviceStatus ? 'white' : colors.shade[13],
                        alignSelf: 'flex-end',
                    }}
                />
            )
        }
        case 'contact': {
            return (
                <i
                    className={'iconoir-contactless'}
                    style={{
                        fontSize: 24,
                        color: deviceStatus ? 'white' : colors.shade[13],
                        alignSelf: 'flex-end',
                    }}
                />
            )
        }
        case 'switch': {
            return (
                <i
                    className={
                        deviceStatus
                            ? 'iconoir-light-bulb-on'
                            : 'iconoir-light-bulb-off'
                    }
                    style={{
                        fontSize: 24,
                        color: deviceStatus ? 'white' : colors.shade[13],
                        alignSelf: 'flex-end',
                    }}
                />
            )
        }
        case 'plug': {
            return (
                <i
                    className={'iconoir-plug-type-c'}
                    style={{
                        fontSize: 24,
                        color: deviceStatus ? 'white' : colors.shade[13],
                        alignSelf: 'flex-end',
                    }}
                />
            )
        }
    }
}
