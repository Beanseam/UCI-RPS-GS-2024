import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AltitudeChart = ({ timeData = [], altData = [] }) => {
  const [chartOptions, setChartOptions] = useState({
<<<<<<< HEAD
    title: { text: 'Altitude (ft) vs. Time' , style:{color:'#FFFFFF'} },
    xAxis: { 
      title: { 
        text: 'Time (min)'  , 
        style:{color:'#FFFFFF'}
      },
      gridLineWidth: 1,
      gridLineColor: '#444',
      tickInterval: 1
    },
    yAxis: { 
      title: { 
        text: 'Altitude (ft)', 
        style:{color:'#FFFFFF'} 
      },    
      gridLineWidth: 1,
      gridLineColor: '#444',
      tickInterval: 1
   },
    series: [{ name: 'Altitude', data: [] }],
    credits: { enabled: false },
    chart:{
      backgroundColor: '#1F2937',
      style: {
        fontFamily: 'Arial, sans-serif',
      },
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
    if (timeData.length === altData.length) {
      const initial = timeData[0] ?? 0;
      const formattedData = timeData.map((t, index) => [(t - initial) / 1000 / 60, altData[index]]);
      setChartOptions(prevOptions => ({
        ...prevOptions,
        series: [{ ...prevOptions.series[0], data: formattedData }]
      }));
    }
  }, [timeData, altData]);

  return (
    <HighchartsReact
      containerProps={{ style: { height: "270px", width: "30vw" } }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default AltitudeChart;
