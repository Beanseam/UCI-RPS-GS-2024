import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
 
const AltitudeChart = ({ timeData = [], altData = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Altitude vs. Time' },
    xAxis: { title: { text: 'Time (sec)' } },
    yAxis: { title: { text: 'Altitude (ft)' } },
    series: [{ name: 'Altitude', data: [] }]
  });
 
  useEffect(() => {
    if (timeData.length === altData.length) {
      const formattedData = timeData.map((t, index) => [t, altData[index]]);
      setChartOptions(prevOptions => ({
        ...prevOptions,
        series: [{ ...prevOptions.series[0], data: formattedData }]
      }));
    }
  }, [timeData, altData]);
 
  return <HighchartsReact containerProps={{ style: { height: "270px" } }} highcharts={Highcharts} options={chartOptions} />;
};
 
export default AltitudeChart;