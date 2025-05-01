import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AccelerationGraph = ({ timeData = [], acelDataX = [], acelDataY = [], acelDataZ = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Acceleration (m/s²) vs. Time (LSM)', style:{color: '#FFFFFF'} },
    //make time 2 decimal places
    xAxis: { 
      title: { text: 'Time (min)' , style:{color:'#FFFFFF'}  }, 
      labels: { formatter: function () { return this.value.toFixed(2);},  style:{color: '#FFFFFF'} 
      } 
    },
    yAxis: { title: { text: 'Acceleration (m/s²)', style:{color:'#FFFFFF'} },  tickColor: '#FFFFFF', },
    series: [
      { name: 'X-Axis', data: [], color: '#7cb5ec' },
      { name: 'Y-Axis', data: [], color: '#FFB511' },
      { name: 'Z-Axis', data: [], color: '#90ed7d' }
    ],

    chart:{
      backgroundColor: '#1F2937',
    },
    credits: { enabled: false },
    legend: {
      itemStyle: {
        color: '#FFFFFF',
      },
      itemHoverStyle: {
        color: '#FFB511',
      },
      itemHiddenStyle: {
        color: '#666',
      },
    },
  });

  useEffect(() => {
    if (timeData.length === acelDataX.length) {
      const initial = timeData[0] ?? 0;
      //subtract initial time then convert ms to min
      const formattedDataX = timeData.map((t, index) => [(t - initial)/1000/60, acelDataX[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [(t - initial)/1000/60, acelDataY[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [(t - initial)/1000/60, acelDataZ[index] ?? 0]);
  
      setChartOptions(prevOptions => ({
        ...prevOptions,
        series: [
          { ...prevOptions.series[0], data: formattedDataX },
          { ...prevOptions.series[1], data: formattedDataY },
          { ...prevOptions.series[2], data: formattedDataZ }
        ]
      }));
    }
  }, [timeData, acelDataX, acelDataY, acelDataZ]);

  return (
    <HighchartsReact
      containerProps={{ style: { height: "270px", width: "30vw"} }}
      highcharts={Highcharts}
      options={chartOptions}
   
    />
  );
};

export default AccelerationGraph;
