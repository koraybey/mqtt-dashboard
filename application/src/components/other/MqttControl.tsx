import { animated, useSpring } from '@react-spring/web'
import type dynamicIconImports from 'lucide-react/dynamicIconImports'
import * as R from 'ramda'
import { useCallback, useEffect } from 'react'

import { Icon } from '@/components/ui/icon'
import { Switch } from '@/components/ui/switch'
import { mqttPublish, useMqttStore, useMqttSubscribe } from '@/utils/mqtt'

const deviceColors: { [key: string]: { on: string; off: string } } = {
    sensor: {
        on: '#d8a200',
        off: 'transparent',
    },
    contact: {
        on: '#d8a200',
        off: 'transparent',
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

const deviceIcons: {
    [key: string]: {
        on: keyof typeof dynamicIconImports
        off: keyof typeof dynamicIconImports
    }
} = {
    sensor: {
        on: 'radar',
        off: 'radar',
    },
    contact: {
        on: 'door-open',
        off: 'door-closed',
    },
    plug: {
        on: 'plug-zap',
        off: 'plug',
    },
    switch: {
        on: 'flashlight',
        off: 'flashlight-off',
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
        if (type === 'sensor' || type === 'contact') return
        const payload = { state: deviceStatus ? 'OFF' : 'ON' }
        mqttPublish(`${topic}/set`, JSON.stringify(payload))
    }, [deviceStatus, topic, type])

    const icon = deviceStatus ? deviceIcons[type].on : deviceIcons[type].off

    const [background, api] = useSpring(() => ({
        bg: deviceColors[type].off,
    }))

    useEffect(() => {
        void api.start({
            bg: deviceStatus ? deviceColors[type].on : deviceColors[type].off,
        })
    }, [api, deviceStatus, topic, type])

    return (
        <div
            className={
                'rounded-lg border dark:bg-zinc-950 dark:hover:bg-zinc-900 duration-200 transition hover:-translate-y-1 hover:scale-101'
            }
            style={{
                position: 'relative',
                minHeight: 180,
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
                <h3 className={'text-xl font-semibold tracking-wide'}>
                    {name}
                </h3>
                <div className={'flex justify-between items-center'}>
                    {type === 'switch' || type === 'plug' ? (
                        <Switch checked={deviceStatus as boolean} />
                    ) : null}
                    <Icon
                        size={32}
                        className={`ml-auto ${
                            deviceStatus
                                ? 'dark:text-white'
                                : 'dark:text-zinc-700'
                        }`}
                        strokeWidth={1}
                        name={icon}
                    />
                </div>
            </div>
            <animated.button
                onClick={handleClick}
                className={'focus-visible:outline-none'}
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
