'use client'

import { Line } from 'react-chartjs-2';
import { registerables } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, TimeScale, TimeSeriesScale } from 'chart.js';
import { enUS } from 'date-fns/locale'; // Import the locale
import 'chartjs-adapter-date-fns'; // Import the adapter

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, TimeScale, TimeSeriesScale, ...registerables);

const LineChart = ({ data, options }) => {
  return (
    <div>
      <Line
        data={data}
        options={options}
      />
    </div>
  );
}

export default LineChart;
