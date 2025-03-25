'use client'

import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Title, CategoryScale, LinearScale, PointElement } from 'chart.js';

const quadrantPlugin = {
  id: 'quadrants',
  beforeDraw: function (chart, args, options) {
    const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
    // Dynamically calculate the center of the chart (midX and midY) based on the axis values
    const midX = x.getPixelForValue(x.min + (x.max - x.min) / 2); // Midpoint of the x-axis
    const midY = y.getPixelForValue(y.min + (y.max - y.min) / 2); // Midpoint of the y-axis

    // Save the context
    ctx.save();

    // Top Left Quadrant (Low Win Percentage, Low Goals + Assists)
    ctx.fillStyle = options.topLeft || 'rgba(255, 99, 132, 0.2)';
    ctx.fillRect(left, top, midX - left, midY - top);

    // Top Right Quadrant (High Win Percentage, Low Goals + Assists)
    ctx.fillStyle = options.topRight || 'rgba(54, 162, 235, 0.2)';
    ctx.fillRect(midX, top, right - midX, midY - top);

    // Bottom Right Quadrant (High Win Percentage, High Goals + Assists)
    ctx.fillStyle = options.bottomRight || 'rgba(75, 192, 192, 0.2)';
    ctx.fillRect(midX, midY, right - midX, bottom - midY);

    // Bottom Left Quadrant (Low Win Percentage, High Goals + Assists)
    ctx.fillStyle = options.bottomLeft || 'rgba(153, 102, 255, 0.2)';
    ctx.fillRect(left, midY, midX - left, bottom - midY);

    // Restore the context
    ctx.restore();
  }
};

ChartJS.register(Tooltip, Title, CategoryScale, LinearScale, PointElement, quadrantPlugin);

const ScatterChart = ({ value }) => {
  const { data, options } = value;

  return (
    <div className='w-[500px] h-full'>
      <Scatter
        data={data}
        options={options}
      />
    </div>
  );
}

export default ScatterChart;