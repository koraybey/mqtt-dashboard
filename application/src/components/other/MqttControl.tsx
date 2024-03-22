import { animated, useSpring } from '@react-spring/web'
import * as R from 'ramda'
import { useCallback, useEffect } from 'react'

import { mqttPublish, useMqttStore, useMqttSubscribe } from '@/utils/mqtt'

const deviceColors: { [key: string]: { on: string; off: string } } = {
    sensor: {
        on: '#d8a200',
        off: 'transparent',
    },
    contact: {
        on: 'transparent',
        off: '#d8a200',
    },
    plug: {
        on: '#d8a200',
        off: 'transparent',
    },
    switch: {
        on: '#d8a200',
        off: 'transparent',
    },
}

const deviceIcons: { [key: string]: { on: string; off: string } } = {
    sensor: {
        on: 'iconoir-running',
        off: 'iconoir-running',
    },
    contact: {
        on: 'iconoir-contactless',
        off: 'iconoir-contactless',
    },
    plug: {
        on: 'iconoir-plug-type-c',
        off: 'iconoir-plug-type-c',
    },
    switch: {
        on: 'iconoir-light-bulb-on',
        off: 'iconoir-light-bulb-off',
    },
}

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
        bg: 'transparent',
    }))

    useEffect(() => {
        void api.start({
            bg: deviceStatus ? deviceColors[type].on : deviceColors[type].off,
        })
    }, [api, deviceStatus, topic, type])

    return (
        <div
            className={'rounded-lg border bg-zinc-950 dark:bg-zinc-900'}
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
                <h3
                    className={
                        'scroll-m-20 text-xl font-semibold tracking-tight'
                    }
                >
                    {name}
                </h3>
                <i
                    className={
                        deviceStatus
                            ? deviceIcons[type].on
                            : deviceIcons[type].off
                    }
                    style={{
                        strokeWidth: 1.5,
                        fontSize: 24,
                        alignSelf: 'flex-end',
                    }}
                />
            </div>
            <animated.button
                onClick={handleClick}
                style={{
                    backgroundColor: background.bg,
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                    overflow: 'hidden',
                }}
            ></animated.button>
        </div>
    )
}
