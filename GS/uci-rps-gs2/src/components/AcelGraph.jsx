import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AccelerationGraph = ({ timeData = [], acelDataX = [], acelDataY = [], acelDataZ = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Acceleration vs. Time (LSM)' },
    xAxis: { title: { text: 'Time (sec)' } },
    yAxis: { title: { text: 'Acceleration (m/s²)' } },
    series: [
      { name: 'X-Axis', data: [] },
      { name: 'Y-Axis', data: [] },
      { name: 'Z-Axis', data: [] }
    ]
  });

  useEffect(() => {
    if (timeData.length === acelDataX.length) {
      const formattedDataX = timeData.map((t, index) => [t, acelDataX[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [t, acelDataY[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [t, acelDataZ[index] ?? 0]);

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
      containerProps={{ style: { height: "270px" } }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default AccelerationGraph;
