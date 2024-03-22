import * as R from 'ramda'
import styled from 'styled-components'
import useSWR from 'swr'

import { MqttControl, Video } from '@/components/other'
import { MqttLogs } from '@/components/other/MqttLogs'
import type { DeviceInfo } from '@/generated/gql/graphql'
import { fetcher } from '@/utils/api'

export const Dashboard = () => {
    const { data, isLoading } = useSWR<{ devices: DeviceInfo[] }>(
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

    if (isLoading || !data) return null

    return (
        <MainContainer className={'container'}>
            <DashboardContainer>
                <Card>
                    <Video />
                </Card>
                <Card>
                    <MqttLogs />
                </Card>
            </DashboardContainer>
            <SwitchContainer>
                {!data || isLoading
                    ? null
                    : R.prop('devices', data).map((device) => (
                          <MqttControl
                              key={device.topic}
                              topic={device.topic}
                              name={device.alias}
                              type={device.deviceType}
                          />
                      ))}
            </SwitchContainer>
            {/* <DashboardContainer>
               <Card>
                    <CardHeader>
                        <CardHeaderInformation>
                            <h2>Link quality</h2>
                            <p style={{ color: colors.shade[4] }}>
                                Device signal strength measured in LQI
                            </p>
                        </CardHeaderInformation>
                    </CardHeader>
                    <ChartContainer>
                        {!log.data || log.isLoading || log.error ? null : (
                            <Area data={log.data} />
                        )}
                    </ChartContainer>
                </Card>
                <Card>
                    <CardHeader>
                        <CardHeaderInformation>
                            <h2>Voltage</h2>
                            <p style={{ color: colors.shade[4] }}>
                                Measured electrical potential value in Volt
                            </p>
                        </CardHeaderInformation>
                    </CardHeader>
                    <ChartContainer>
                        {!log.data || log.isLoading || log.error ? null : (
                            <Line data={log.data} />
                        )}
                    </ChartContainer>
                </Card> 
            </DashboardContainer> */}
        </MainContainer>
    )
}

const MainContainer = styled.div`
    position: relative;
    padding: 32px;
    display: flex;
    gap: 12px;
    flex-direction: column;
    @media (max-width: 600px) {
        padding: 16px;
    }
`

const SwitchContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 12px;
    @media (max-width: 600px) {
        grid-template-columns: repeat(3, 1fr);
    }
`

const DashboardContainer = styled.div`
    position: relative;
    display: grid;
    grid-column-start: auto;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 12px;
    height: 400px;
    @media (max-width: 600px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

const Card = styled.div`
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    min-width: 320px;
    @media (max-width: 600px) {
    }
`

// const CardHeader = styled.div`
//     position: relative;
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     justify-content: space-between;
//     padding: 16px;
// `

// const CardHeaderInformation = styled.div`
//     position: relative;
//     display: flex;
//     flex-direction: column;
//     gap: 12px;
// `

// const ChartContainer = styled.div`
//     height: 280px;
//     @media (max-width: 600px) {
//         height: 200px;
//     }
// `
