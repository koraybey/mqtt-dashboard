import styled from 'styled-components'
import useSWR from 'swr'

import { Area, Line } from '@/components/charts'
import { MqttControl, Video } from '@/components/other'
import { MqttLogs } from '@/components/other/MqttLogs'
import { colors } from '@/theme/colors'
import { deviceFetcher, logFetcher } from '@/utils/api'

export const Dashboard = () => {
    const devices = useSWR('/devices', deviceFetcher)
    const log = useSWR('/log', logFetcher)

    return (
        <MainContainer>
            <DashboardContainer>
                <SwitchContainer>
                    {!devices.data || devices.isLoading || devices.error
                        ? null
                        : Object.entries(devices.data).map(([key, value]) => (
                              <MqttControl
                                  key={key}
                                  topic={key}
                                  name={value.name}
                                  type={value.type}
                              />
                          ))}
                </SwitchContainer>
                <Card>
                    <Video />
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
                            <Area data={log.data} />
                        )}
                    </ChartContainer>
                </Card>
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
                            <Line data={log.data} />
                        )}
                    </ChartContainer>
                </Card>
            </DashboardContainer>
            <Card>
                <MqttLogs />
            </Card>
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
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 12px;
    height: 400px;
`

const DashboardContainer = styled.div`
    position: relative;
    display: grid;
    grid-column-start: auto;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 12px;
    @media (max-width: 600px) {
        grid-template-columns: repeat(1, 1fr);
    }
`

const Card = styled.div`
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    height: 400px;
    min-width: 320px;
`

const CardHeader = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
`

const CardHeaderInformation = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const ChartContainer = styled.div`
    height: 280px;
`
