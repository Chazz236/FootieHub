'use client'

import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Title, CategoryScale, LinearScale, PointElement } from 'chart.js';

//custom plugin for colouring the quadrants of the chart
const quadrantPlugin = {
  id: 'quadrants',
  beforeDraw: function (chart, args, options) {
    const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
    //find center of chart
    const midX = x.getPixelForValue(x.min + (x.max - x.min) / 2);
    const midY = y.getPixelForValue(y.min + (y.max - y.min) / 2);

    ctx.save();

    //top left quadrant
    ctx.fillStyle = options.topLeft || '#fdf90033';
    ctx.fillRect(left, top, midX - left, midY - top);

    //top right quadrant
    ctx.fillStyle = options.topRight || '#84cc1633';
    ctx.fillRect(midX, top, right - midX, midY - top);

    //bottom right quadrant
    ctx.fillStyle = options.bottomRight || '#fdf90033';
    ctx.fillRect(midX, midY, right - midX, bottom - midY);

    //bottom left quadrant
    ctx.fillStyle = options.bottomLeft || '#dc262633';
    ctx.fillRect(left, midY, midX - left, bottom - midY);

    ctx.restore();
  }
};

ChartJS.register(Tooltip, Title, CategoryScale, LinearScale, PointElement);

//component that creates a scatter chart
const ScatterChart = ({ data, options }) => {

  const chartOptions = {
    ...options,
    plugins: {
      ...options?.plugins,
      quadrants: {
        ...options?.plugins?.quadrants
      }
    }
  };

  return (
    <div className='w-[500px] h-full'>
      <Scatter
        data={data}
        options={chartOptions}
        plugins={[quadrantPlugin]}
      />
    </div>
  );
}

export default ScatterChart;