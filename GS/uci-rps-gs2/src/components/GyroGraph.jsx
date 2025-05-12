import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const GyroGraph = ({ timeData = [], gyroDataX = [], gyroDataY = [], gyroDataZ = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Angular Speed (rad/s) vs. Time' , style:{color:'#FFFFFF'}},
    xAxis: { title: { text: 'Time (min)' , style:{color:'#FFFFFF'}} },
    yAxis: { title: { text: 'Angular Speed (rad/s)' , style:{color:'#FFFFFF'}} },
    series: [
      { name: 'X-Axis', data: [], color: '#7cb5ec' },
      { name: 'Y-Axis', data: [], color: '#FFB511' },
      { name: 'Z-Axis', data: [], color: '#90ed7d' }
    ], chart:{
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
    if (timeData.length === gyroDataX.length) {
      const initial = timeData[0] ?? 0;
      const formattedDataX = timeData.map((t, index) => [(t - initial)/1000/60, gyroDataX[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [(t - initial)/1000/60, gyroDataY[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [(t - initial)/1000/60, gyroDataZ[index] ?? 0]);

      setChartOptions(prevOptions => ({
        ...prevOptions,
        series: [
          { ...prevOptions.series[0], data: formattedDataX },
          { ...prevOptions.series[1], data: formattedDataY },
          { ...prevOptions.series[2], data: formattedDataZ }
        ]
      }));
    }
  }, [timeData, gyroDataX, gyroDataY, gyroDataZ]);

  return (
    <HighchartsReact
    containerProps={{ style: { height: "270px", width: "30vw"} }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default GyroGraph;
