import * as R from 'ramda'
import ReactPlayer from 'react-player/lazy'
import useSWR from 'swr'

import { MqttControl } from '@/components/other'
import { Card } from '@/components/ui/card'
import type { DeviceInfo } from '@/generated/gql/graphql'
import { fetcher } from '@/utils/api'

export const Dashboard = () => {
    const streamUrl = import.meta.env.VITE_STREAM_URL
    const { data: deviceData } = useSWR<{
        devices: DeviceInfo[]
    }>(
        `{
            devices {
              topic
              alias
              deviceType
              qos
            }
          }`,
        fetcher
    )

    return (
        <div className={'container grid_container'}>
            <Card className={'h-[400px]'}>
                {streamUrl ? (
                    <ReactPlayer
                        playing
                        stopOnUnmount
                        muted
                        width={'100%'}
                        height={'100%'}
                        playsinline
                        url={streamUrl}
                    />
                ) : (
                    <div className={'flex items-center justify-center h-full'}>
                        <p className={'text-red-500 font-semibold'}>
                            Stream not found. Please check configuration.
                        </p>
                    </div>
                )}
            </Card>
            <div className={'h-[400px] grid gap-2 grid-cols-4'}>
                {deviceData &&
                    R.prop('devices', deviceData)
                        .slice(0, 8)
                        .map((device) => (
                            <MqttControl
                                key={device.topic}
                                topic={device.topic}
                                name={device.alias}
                                type={device.deviceType}
                            />
                        ))}
            </div>
        </div>
    )
}
