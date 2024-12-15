import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'

export default class Container extends React.Component {
    constructor() {
        super()
        this.state = {
            chartOptions: {
                title: {
                    text: 'Angular Speed vs. Time'
                },
                xAxis: {
                    title: {
                        text: 'Time (sec)'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Angular Speed (rad/s)'
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
        if (prevProps.gyroDataX !== this.props.gyroDataX) {
            this.setState(prevState => ({
                chartOptions: {
                    ...prevState.chartOptions,
                    series: [
                        {
                            ...prevState.chartOptions.series[0],
                            data: this.props.gyroDataX
                        },
                        {
                            ...prevState.chartOptions.series[1],
                            data: this.props.gyroDataY
                        },
                        {
                            ...prevState.chartOptions.series[2],
                            data: this.props.gyroDataZ
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