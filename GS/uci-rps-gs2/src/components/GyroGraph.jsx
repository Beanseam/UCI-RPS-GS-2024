import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const GyroGraph = ({ timeData = [], gyroDataX = [], gyroDataY = [], gyroDataZ = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Angular Speed vs. Time' },
    xAxis: { title: { text: 'Time (sec)' } },
    yAxis: { title: { text: 'Angular Speed (rad/s)' } },
    series: [
      { name: 'X-Axis', data: [] },
      { name: 'Y-Axis', data: [] },
      { name: 'Z-Axis', data: [] }
    ]
  });

  useEffect(() => {
    if (timeData.length === gyroDataX.length) {
      const formattedDataX = timeData.map((t, index) => [t, gyroDataX[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [t, gyroDataY[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [t, gyroDataZ[index] ?? 0]);

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
      containerProps={{ style: { height: "270px" } }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default GyroGraph;
