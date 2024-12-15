// import React from 'react'
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// // import "./Graph.css";

// Highcharts.chart('container', {
//   chart: {
//     type: 'spline',
//     animation: Highcharts.svg, // don't animate in old IE
//     marginRight: 10,
//     events: {
//       load: function() {
//         var chart = this;
//         setInterval(function() {
//           chart.series.forEach(function(s) {
//             for (var i = 0; i < 20; i++) {
//               s.addPoint(Math.random(), false, true);
//             }
//           });
//           chart.redraw();
//         }, 1000);
//       }
//     }
//   },
//   series: [{}, {}, {}].map(function(s) {
//     s.data = [];
//     for (var i = 0; i < 100; i++) {
//       s.data.push(Math.random());
//     }
//     return s;
//   })
// });


// function Graph() {
//   return (
//     <div className="flexbox-container">
//       Graph1

//       <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
//     </div>
//   )
// }

// export default Graph






import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'

export default class Container extends React.Component {
    constructor() {
        super()
        this.state = {
            chartOptions: {
                title: {
                    text: 'Magnetic Field vs. Time'
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
        if (prevProps.magDataX !== this.props.magDataX) {
            this.setState(prevState => ({
                chartOptions: {
                    ...prevState.chartOptions,
                    series: [
                        {
                            ...prevState.chartOptions.series[0],
                            data: this.props.magDataX
                        },
                        {
                            ...prevState.chartOptions.series[1],
                            data: this.props.magDataY
                        },
                        {
                            ...prevState.chartOptions.series[2],
                            data: this.props.magDataZ
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