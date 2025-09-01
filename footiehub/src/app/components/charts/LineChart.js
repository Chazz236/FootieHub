'use client'

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale, Colors } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the adapter

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale, Colors);

const LineChart = ({ data, options }) => {
  return (
    <Line
      data={data}
      options={options}
    />
  );
}

export default LineChart;
