import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
 
const AltitudeChart = ({ timeData = [], altData = [] }) => {
  const [chartOptions, setChartOptions] = useState({
    title: { text: 'Altitude (ft) vs. Time' },
    xAxis: { title: { text: 'Time (min)' } },
    yAxis: { title: { text: 'Altitude (ft)' } },
    series: [{ name: 'Altitude', data: [] }]
  });
 
  useEffect(() => {
    if (timeData.length === altData.length) {
      const initial = timeData[0] ?? 0;
      const formattedData = timeData.map((t, index) => [(t - initial)/1000/60, altData[index]]);
      setChartOptions(prevOptions => ({
        ...prevOptions,
        series: [{ ...prevOptions.series[0], data: formattedData }]
      }));
    }
  }, [timeData, altData]);
 
  return <HighchartsReact containerProps={{ style: { height: "270px", width: "30vw"} }}
   highcharts={Highcharts} options={chartOptions} />;
};
 
export default AltitudeChart;