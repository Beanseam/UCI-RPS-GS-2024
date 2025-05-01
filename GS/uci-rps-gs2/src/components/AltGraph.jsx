import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AltitudeChart = ({ timeData = [], altData = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      backgroundColor: '#1e1e1e',
      style: {
        fontFamily: 'Arial, sans-serif',
      },
    },
    title: {
      text: 'Altitude (ft) vs. Time',
      style: {
        color: '#ffffff'
      }
    },
    xAxis: {
      title: {
        text: 'Time (min)',
        style: {
          color: '#ffffff'
        }
      },
      gridLineWidth: 1,
      gridLineColor: '#444',
      labels: {
        style: {
          color: '#ffffff'
        }
      },
      tickInterval: 1
    },
    yAxis: {
      title: {
        text: 'Altitude (ft)',
        style: {
          color: '#ffffff'
        }
      },
      gridLineWidth: 1,
      gridLineColor: '#444',
      labels: {
        style: {
          color: '#ffffff'
        }
      },
      tickInterval: 100 // adjust this based on your altitude scale
    },
    legend: {
      itemStyle: {
        color: '#ffffff'
      }
    },
    tooltip: {
      style: {
        color: '#ffffff'
      }
    },
    series: [{
      name: 'Altitude',
      data: [],
      color: '#00ffcc' // optional: set line color
    }]
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
