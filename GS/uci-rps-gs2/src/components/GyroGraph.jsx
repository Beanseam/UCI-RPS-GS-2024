import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const GyroGraph = ({ timeData = [], gyroDataX = [], gyroDataY = [], gyroDataZ = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Angular Speed (rad/s) vs. Time' },
    xAxis: { title: { text: 'Time (min)' } },
    yAxis: { title: { text: 'Angular Speed (rad/s)' } },
    series: [
      { name: 'X-Axis', data: [] },
      { name: 'Y-Axis', data: [] },
      { name: 'Z-Axis', data: [] }
    ]
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
