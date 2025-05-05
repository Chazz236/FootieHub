'use client'

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

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
