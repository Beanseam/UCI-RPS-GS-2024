import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

export default class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            chartOptionsX: {
                title: {
                    text: 'Magnetic Field (X-Axis) vs. Time'
                },
                xAxis: {
                    title: {
                        text: 'Time (sec)'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Magnetic Field (uTesla)'
                    }
                },
                series: [
                    {
                        name: 'X-Axis',
                        data: []
                    }
                ]
            },
            chartOptionsY: {
                title: {
                    text: 'Magnetic Field (Y-Axis) vs. Time'
                },
                xAxis: {
                    title: {
                        text: 'Time (sec)'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Magnetic Field (uTesla)'
                    }
                },
                series: [
                    {
                        name: 'Y-Axis',
                        data: []
                    }
                ]
            },
            chartOptionsZ: {
                title: {
                    text: 'Magnetic Field (Z-Axis) vs. Time'
                },
                xAxis: {
                    title: {
                        text: 'Time (sec)'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Magnetic Field (uTesla)'
                    }
                },
                series: [
                    {
                        name: 'Z-Axis',
                        data: []
                    }
                ]
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.magDataX !== this.props.magDataX || 
            prevProps.magDataY !== this.props.magDataY || 
            prevProps.magDataZ !== this.props.magDataZ) {
            
            this.setState(prevState => ({
                chartOptionsX: {
                    ...prevState.chartOptionsX,
                    series: [
                        {
                            ...prevState.chartOptionsX.series[0],
                            data: this.props.magDataX
                        }
                    ]
                },
                chartOptionsY: {
                    ...prevState.chartOptionsY,
                    series: [
                        {
                            ...prevState.chartOptionsY.series[0],
                            data: this.props.magDataY
                        }
                    ]
                },
                chartOptionsZ: {
                    ...prevState.chartOptionsZ,
                    series: [
                        {
                            ...prevState.chartOptionsZ.series[0],
                            data: this.props.magDataZ
                        }
                    ]
                }
            }));
        }
    }

    render() {
        return (
            <div>
                <HighchartsReact
                containerProps={{ style: {height: "180px" } }}
                    highcharts={Highcharts}
                    options={this.state.chartOptionsX}
                />
                <HighchartsReact
                containerProps={{ style: {height: "180px" } }}
                    highcharts={Highcharts}
                    options={this.state.chartOptionsY}
                />
                <HighchartsReact
                containerProps={{ style: {height: "180px" } }}
                    highcharts={Highcharts}
                    options={this.state.chartOptionsZ}
                />
            </div>
        );
    }
}