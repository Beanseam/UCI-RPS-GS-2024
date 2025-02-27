import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';


HighchartsMore(Highcharts);

export default class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            chartOptions: {
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    height: '53%'
                },
                title: {
                    text: 'Altitude'
                },
                pane: {
                    startAngle: -90,
                    endAngle: 89.9,
                    background: null,
                    center: ['50%', '75%'],
                    size: '110%'
                },
                yAxis: {
                    min: 0,
                    max: 10000,
                    tickPixelInterval: 72,
                    tickPosition: 'inside',
                    tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
                    tickLength: 20,
                    tickWidth: 2,
                    minorTickInterval: null,
                    labels: {
                        distance: 20,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    lineWidth: 0,
                    plotBands: [{
                        from: 0,
                        to: 10000,
                        color: '#354acd', // green
                        thickness: 20
                    }]
                },
                series: [{
                    name: 'Speed',
                    data: [5000],
                    tooltip: {
                        valueSuffix: ' ft'
                    },
                    dataLabels: {
                        format: '{y} ft',
                        borderWidth: 0,
                        color: (
                            Highcharts.defaultOptions.title &&
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || '#333333',
                        style: {
                            fontSize: '24px'
                        }
                    },
                    dial: {
                        radius: '80%',
                        backgroundColor: 'gray',
                        baseWidth: 12,
                        baseLength: '0%',
                        rearLength: '0%'
                    },
                    pivot: {
                        backgroundColor: 'gray',
                        radius: 6
                    }

                }]
            }
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.altValue !== this.props.altValue) {
            this.setState(prevState => ({
                chartOptions: {
                    ...prevState.chartOptions,
                    series: [
                        {
                            ...prevState.chartOptions.series[0],
                            data: [this.props.altValue]
                        }
                    ]
                }
            }));
        }
    }

    render() {
        return (
            <HighchartsReact
            containerProps={{ style: {width: "25%" } }}
                highcharts={Highcharts}
                options={this.state.chartOptions}
            />
        );
    }
}
