const TransferCompare = () => {
  return (
    <main className='flex-1 p-6'>
      <div className=''>
        Transfer Compare page
      </div>
    </main>
  )
}

export default TransferCompare;


// const transferData = {
//     datasets: [
//       {
//         label: 'Transfer Change',
//         data: sortedTransferChanges.map(change => {
//           values.unshift(value);
//           value -= change.value_change;
//           return {
//             x: new Date(change.date),
//             y: values[0]
//           };
//         }),
//         borderColor: 'rgb(75, 192, 192)',
//         tension: 0.1,
//         fill: false
//       }
//     ]
//   };

//   const yValues = transferData.datasets[0].data.map(item => item.y);
//   const minY = Math.min(...yValues);
//   const maxY = Math.max(...yValues);

//   const transferOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Market Value Over Time',
//         font: {
//           size: 18,
//         },
//       },
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//       },
//     },
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           unit: 'month',
//           displayFormats: {
//             month: 'MMM',
//           },
//         },
//         ticks: {
//           autoSkip: true,
//           // maxTicksLimit: 10
//         },
//         title: {
//           display: true,
//           text: 'Month',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Value',
//         },
//         min: Math.round(minY * 1.1),
//         max: Math.round(maxY * 1.1)
//       },
//     },
//   };