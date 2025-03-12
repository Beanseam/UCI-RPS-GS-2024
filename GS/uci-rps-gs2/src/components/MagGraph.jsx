import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const MagneticFieldGraph = ({ timeData = [], magDataX = [], magDataY = [], magDataZ = [] }) => {
  const [chartOptionsX, setChartOptionsX] = useState({
    title: { text: 'Magnetic Field (X-Axis) vs. Time' },
    xAxis: { title: { text: 'Time (sec)' } },
    yAxis: { title: { text: 'Magnetic Field (uTesla)' } },
    series: [{ name: 'X-Axis', data: [] }]
  });

  const [chartOptionsY, setChartOptionsY] = useState({
    title: { text: 'Magnetic Field (Y-Axis) vs. Time' },
    xAxis: { title: { text: 'Time (sec)' } },
    yAxis: { title: { text: 'Magnetic Field (uTesla)' } },
    series: [{ name: 'Y-Axis', data: [] }]
  });

  const [chartOptionsZ, setChartOptionsZ] = useState({
    title: { text: 'Magnetic Field (Z-Axis) vs. Time' },
    xAxis: { title: { text: 'Time (sec)' } },
    yAxis: { title: { text: 'Magnetic Field (uTesla)' } },
    series: [{ name: 'Z-Axis', data: [] }]
  });

  useEffect(() => {
    if (timeData.length === magDataX.length) {
      const formattedDataX = timeData.map((t, index) => [t, magDataX[index] ?? 0]);
      const formattedDataY = timeData.map((t, index) => [t, magDataY[index] ?? 0]);
      const formattedDataZ = timeData.map((t, index) => [t, magDataZ[index] ?? 0]);

      setChartOptionsX(prevOptions => ({
        ...prevOptions,
        series: [{ ...prevOptions.series[0], data: formattedDataX }]
      }));

      setChartOptionsY(prevOptions => ({
        ...prevOptions,
        series: [{ ...prevOptions.series[0], data: formattedDataY }]
      }));

      setChartOptionsZ(prevOptions => ({
        ...prevOptions,
        series: [{ ...prevOptions.series[0], data: formattedDataZ }]
      }));
    }
  }, [timeData, magDataX, magDataY, magDataZ]);

  return (
    <div>
      <HighchartsReact 
        containerProps={{ style: { height: "180px" } }} 
        highcharts={Highcharts} 
        options={chartOptionsX} 
      />
      <HighchartsReact 
        containerProps={{ style: { height: "180px" } }} 
        highcharts={Highcharts} 
        options={chartOptionsY} 
      />
      <HighchartsReact 
        containerProps={{ style: { height: "180px" } }} 
        highcharts={Highcharts} 
        options={chartOptionsZ} 
      />
    </div>
  );
};

export default MagneticFieldGraph;
