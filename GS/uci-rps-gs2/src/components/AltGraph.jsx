import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

export default class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      chartOptions: {
        title: {
          text: 'Altitude vs. Time'
        },
        xAxis: {
          title: {
            text: 'Time (sec)'
          }
        },
        yAxis: {
          title: {
            text: 'Altitude (ft)'
          }
        },
        series: [
          {
            name: 'Altitude',
            data: []
          }
        ]
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.timeData !== this.props.timeData) {
      data = {
        x: this.props.timeData,
        y: this.props.altData
      }
      this.setState(prevState => ({
        chartOptions: {
          ...prevState.chartOptions,
          series: [
            {
              ...prevState.chartOptions.series[0],
              data
            }
          ]
        }
      }));
    }
  }

  render() {
    return (
      <HighchartsReact
        containerProps={{ style: { height: "66.66%" } }}
        highcharts={Highcharts}
        options={this.state.chartOptions}
      />
    );
  }
}
