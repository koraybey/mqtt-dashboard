import { animated, useSpring } from '@react-spring/web'
import type dynamicIconImports from 'lucide-react/dynamicIconImports'
import * as R from 'ramda'
import { useCallback, useEffect } from 'react'

import { Icon } from '@/components/ui/icon'
import { Switch } from '@/components/ui/switch'
import { mqttPublish, useMqttStore, useMqttSubscribe } from '@/utils/mqtt'

import { Card } from '../ui/card'
import { LoadingSpinner } from '../ui/loading-spinner'

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
    const isConnected = useMqttStore((state) => state.isConnected)
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
        <Card className={'h-48'}>
            {isConnected ? (
                <animated.div
                    className={
                        'flex flex-col justify-between content-start p-4 w-full h-full focus-visible:outline-none'
                    }
                    style={{
                        backgroundColor: background.bg,
                    }}
                >
                    <h3
                        className={
                            'text-xl font-semibold tracking-wide text-left'
                        }
                    >
                        {name}
                    </h3>
                    <div className={'flex w-full justify-between items-center'}>
                        {type === 'switch' || type === 'plug' ? (
                            <Switch
                                onClick={handleClick}
                                checked={deviceStatus as boolean}
                            />
                        ) : undefined}
                        <Icon
                            size={32}
                            className={`ml-auto ${
                                deviceStatus ? 'text-white' : 'text-zinc-700'
                            }`}
                            strokeWidth={1}
                            name={icon}
                        />
                    </div>
                </animated.div>
            ) : (
                <div
                    className={'flex items-center justify-center w-full h-full'}
                >
                    <LoadingSpinner />
                </div>
            )}
        </Card>
    )
}
