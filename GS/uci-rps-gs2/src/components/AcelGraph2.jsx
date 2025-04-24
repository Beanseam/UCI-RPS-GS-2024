import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AccelerationGraphLIS = ({ timeData = [], acelDataX2 = [], acelDataY2 = [], acelDataZ2 = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Acceleration vs. Time (LIS)' },
    xAxis: { title: { text: 'Time (sec)' } },
    yAxis: { title: { text: 'Acceleration (m/s²)' } },
    series: [
      { name: 'X-Axis', data: [] },
      { name: 'Y-Axis', data: [] },
      { name: 'Z-Axis', data: [] }
    ]
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
      containerProps={{ style: { height: "270px" } }}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default AccelerationGraphLIS;
