import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AccelerationGraph = ({ timeData = [], acelDataX = [], acelDataY = [], acelDataZ = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      backgroundColor: '#1e1e1e',
      style: {
        fontFamily: 'Arial, sans-serif',
      },
    },
    title: {
      text: 'Acceleration (m/s²) vs. Time (LSM)',
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
      labels: {
        style: {
          color: '#ffffff'
        },
        formatter: function () {
          return this.value.toFixed(2); // 2 decimal places
        }
      },
      gridLineWidth: 1,
      gridLineColor: '#444',
      tickInterval: 1 // adjust based on how much data you have
    },
    yAxis: {
      title: {
        text: 'Acceleration (m/s²)',
        style: {
          color: '#ffffff'
        }
      },
      labels: {
        style: {
          color: '#ffffff'
        }
      },
      gridLineWidth: 1,
      gridLineColor: '#444',
      tickInterval: 1 // adjust to fit your data range
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
    series: [
      { name: 'X-Axis', data: [], color: '#ff6666' },
      { name: 'Y-Axis', data: [], color: '#66ccff' },
      { name: 'Z-Axis', data: [], color: '#66ff66' }
    ]
  });

  useEffect(() => {
    if (timeData.length === acelDataX.length) {
      const initial = timeData[0] ?? 0;
      const formattedDataX = timeData.map((t, index) => [(t - initial) / 1000 / 60, acelDataX[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [(t - initial) / 1000 / 60, acelDataY[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [(t - initial) / 1000 / 60, acelDataZ[index] ?? 0]);

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
      containerProps={{ style: { height: "270px", width: "30vw" } }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default AccelerationGraph;
