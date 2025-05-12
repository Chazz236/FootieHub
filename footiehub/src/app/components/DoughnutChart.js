'use client'

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, ArcElement } from 'chart.js';
import { useEffect } from 'react';

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const ctx = chart.ctx;
    const { width, height } = chart;
    const fontSize = 24;  // Define font size (adjust this as necessary)
    const font = `bold ${fontSize}px Arial`;  // Use font size in the font string
    const text = chart.options.plugins.centerText.text || 'No Data';  // Get the text dynamically

    ctx.save();
    ctx.font = font;
    ctx.fillStyle = chart.options.plugins.centerText.color || 'rgba(0, 0, 0, 0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';  // Ensure text is vertically centered

    // Adjust the vertical alignment based on font size if needed
    const yPosition = height / 2 + fontSize / 1.2;  // Adjust for better vertical centering

    // Draw the text at the center of the doughnut chart
    ctx.fillText(text, width / 2, yPosition);
    ctx.restore();
  }
};

ChartJS.register(Title, ArcElement);

const DoughnutChart = ({ data, options }) => {

  useEffect(() => {
    ChartJS.register(centerTextPlugin);
    return () => {
      ChartJS.unregister(centerTextPlugin);
    }
  }, [])

  return (
    <div>
      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
}

export default DoughnutChart;