import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AccelerationGraphLIS = ({ timeData = [], acelDataX2 = [], acelDataY2 = [], acelDataZ2 = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Acceleration (m/s²) vs. Time (LIS)',  style:{color: '#FFFFFF'}  },
    xAxis: { title: { text: 'Time (min)',  style:{color: '#FFFFFF'} } },
    yAxis: { title: { text: 'Acceleration (m/s²)',  style:{color: '#FFFFFF'} } },
    series: [
      { name: 'X-Axis', data: [], color: '#7cb5ec' },
      { name: 'Y-Axis', data: [], color: '#FFB511' },
      { name: 'Z-Axis', data: [], color: '#90ed7d' }
    ],  
     credits: { enabled: false },
     chart:{
      backgroundColor: '#1F2937',
    },
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
    if (timeData.length === acelDataX2.length) {
      const initial = timeData[0] ?? 0;
      const formattedDataX = timeData.map((t, index) => [(t - initial)/1000/60, acelDataX2[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [(t - initial)/1000/60, acelDataY2[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [(t - initial)/1000/60, acelDataZ2[index] ?? 0]);

      setChartOptions(prevOptions => ({
        ...prevOptions,
        series: [
          { ...prevOptions.series[0], data: formattedDataX },
          { ...prevOptions.series[1], data: formattedDataY },
          { ...prevOptions.series[2], data: formattedDataZ }
        ]
      }));
    }
  }, [timeData, acelDataX2, acelDataY2, acelDataZ2]);

  return (
    <HighchartsReact 
      containerProps={{ style: { height: "270px", width: "30vw"} }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default AccelerationGraphLIS;
