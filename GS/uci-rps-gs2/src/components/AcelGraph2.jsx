import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'

export default class Container extends React.Component {
    constructor() {
        super()
        this.state = {
            chartOptions: {
                title: {
                    text: 'Acceleration vs. Time (LIS)'
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
                        name: 'Z-Axis', // Title for series 3
                        data: []
                    }
                ]
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.acelDataX2 !== this.props.acelDataX2) {
            this.setState(prevState => ({
                chartOptions: {
                    ...prevState.chartOptions,
                    series: [
                        {
                            ...prevState.chartOptions.series[0],
                            data: this.props.acelDataX2
                        },
                        {
                            ...prevState.chartOptions.series[1],
                            data: this.props.acelDataY2
                        },
                        {
                            ...prevState.chartOptions.series[2],
                            data: this.props.acelDataZ2
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
