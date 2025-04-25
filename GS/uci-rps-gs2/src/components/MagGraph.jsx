import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const MagneticFieldGraph = ({ timeData = [], magDataX = [], magDataY = [], magDataZ = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Magnetic Field (uTesla) vs. Time' },
    xAxis: { 
      title: { text: 'Time (min)' },
      labels: {
        formatter: function () {
          return this.value.toFixed(2); // display 2 decimal places
        }
      }
    },
    yAxis: { title: { text: 'Magnetic Field (uTesla)' } },
    series: [
      { name: 'X-Axis', data: [] },
      { name: 'Y-Axis', data: [] },
      { name: 'Z-Axis', data: [] }
    ]
  });

  useEffect(() => {
    if (timeData.length === magDataX.length) {
      const initial = timeData[0] ?? 0;
      const formattedDataX = timeData.map((t, index) => [(t - initial) / 1000 / 60, magDataX[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [(t - initial) / 1000 / 60, magDataY[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [(t - initial) / 1000 / 60, magDataZ[index] ?? 0]);

      setChartOptions(prevOptions => ({
        ...prevOptions,
        series: [
          { ...prevOptions.series[0], data: formattedDataX },
          { ...prevOptions.series[1], data: formattedDataY },
          { ...prevOptions.series[2], data: formattedDataZ }
        ]
      }));
    }
  }, [timeData, magDataX, magDataY, magDataZ]);

  return (
    <HighchartsReact
    containerProps={{ style: { height: "270px", width: "30vw"} }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default MagneticFieldGraph;
