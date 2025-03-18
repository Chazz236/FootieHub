'use client'

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement } from 'chart.js';

ChartJS.register(ArcElement);

const DoughnutChart = ({ value }) => {
  return (
    <div className='w-32 h-32'>
      <Doughnut
        data={{
          datasets: [{ data: [100 - value, value], backgroundColor: ['#f0f0f0', '#28a745'] }]
        }}
      />
    </div>
  );
}

export default DoughnutChart;