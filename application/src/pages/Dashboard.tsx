import * as R from 'ramda'
import ReactPlayer from 'react-player/lazy'
import useSWR from 'swr'

import { Line } from '@/components/charts'
import { MqttControl } from '@/components/other'
import { MqttLogs } from '@/components/other/MqttLogs'
import { Card, CardHeader } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { DeviceInfo, LogMessage } from '@/generated/gql/graphql'
import { fetcher } from '@/utils/api'

export const Dashboard = () => {
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

    const { data: logData, isLoading: isLoadingLogData } = useSWR<{
        logs: LogMessage[]
    }>(
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

    return (
        <div className={'container grid_container'}>
            <Card className={'h-[400px]'}>
                <ReactPlayer
                    playing
                    stopOnUnmount
                    muted
                    width={'100%'}
                    height={'100%'}
                    playsinline
                    url={
                        'http://10.147.17.93:8083/stream/home/channel/0/hls/live/index.m3u8'
                    }
                />
            </Card>
            <Card className={'h-[400px] p-4 overflow-scroll'}>
                {isLoadingLogData || !logData ? (
                    <div
                        className={
                            'flex items-center justify-center w-full h-full'
                        }
                    >
                        <LoadingSpinner />
                    </div>
                ) : (
                    <MqttLogs data={logData} />
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
            <Card className={'h-[400px] p-4'}>
                {isLoadingLogData || !logData ? (
                    <div
                        className={
                            'flex items-center justify-center w-full h-full'
                        }
                    >
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <CardHeader>
                            <h2
                                className={
                                    'text-3xl font-semibold tracking-wide'
                                }
                            >
                                Link quality
                            </h2>
                            <p className={'text-zinc-400'}>
                                Device signal strength measured in LQI
                            </p>
                        </CardHeader>
                        <div className={'flex-auto flex-grow-1'}>
                            <Line data={R.prop('logs', logData)} />
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}
