'use client'

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, ArcElement } from 'chart.js';

//custom plugin to display text in the center of the doughnut chart
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const ctx = chart.ctx;
    const { width, height } = chart;
    const fontSize = 24;
    const font = `bold ${fontSize}px Arial`;
    const text = chart.options.plugins.centerText.text || 'No Data';

    ctx.save();
    ctx.font = font;
    ctx.fillStyle = chart.options.plugins.centerText.color || 'rgba(0, 0, 0, 0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    //adjust vertical position using height and fontsize
    const yPosition = height / 2 + fontSize / 1;

    ctx.fillText(text, width / 2, yPosition);
    ctx.restore();
  }
};

ChartJS.register(Title, ArcElement);

//component that creates a doughnut chart
const DoughnutChart = ({ data, options }) => {

  const chartOptions = {
    ...options,
    plugins: {
      ...options?.plugins,
      centerText: {
        ...options?.plugins?.centerText
      }
    }
  };

  return (
    <div>
      <Doughnut
        data={data}
        options={chartOptions}
        plugins={[centerTextPlugin]}
      />
    </div>
  );
}

export default DoughnutChart;