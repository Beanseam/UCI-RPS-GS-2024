import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'

export default class Container extends React.Component {
    constructor() {
        super()
        this.state = {
            chartOptions: {
                title: {
                    text: 'Acceleration vs. Time (LSM)'
                },
                xAxis: {
                    title: {
                        text: 'Time (sec)'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Acceleration (m/s^2)'
                    }
                },
                series: [
                    {
                        name: 'X-Axis',
                        data: []
                    },
                    {
                        name: 'Y-Axis',
                        data: []
                    },
                    {
                        name: 'Z-Axis',
                        data: []
                    }
                ]
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.acelDataX !== this.props.acelDataX) {
            this.setState(prevState => ({
                chartOptions: {
                    ...prevState.chartOptions,
                    series: [
                        {
                            ...prevState.chartOptions.series[0],
                            data: this.props.acelDataX
                        },
                        {
                            ...prevState.chartOptions.series[1],
                            data: this.props.acelDataY
                        },
                        {
                            ...prevState.chartOptions.series[2],
                            data: this.props.acelDataZ
                        }
                    ]
                }
            }));
        }
    }

    render() {
        return (
            <HighchartsReact
                containerProps={{ style: { height: "33.33%" } }}
                highcharts={Highcharts}
                options={this.state.chartOptions}
            />
        );
    }
}
