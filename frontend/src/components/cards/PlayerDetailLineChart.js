import { useEffect } from 'react';
import { MIN_YEAR, MAX_YEAR } from '../../helpers';
import Chart from 'chart.js/auto';
import './PlayerDetailLineChart.css';

const PlayerDetailLineChart = ({
  player,
  statLabel,
  lineColor = 'rgb(255, 99, 132)',
  playerMainStatCategory,
}) => {
  const chartId = `player-chart-${playerMainStatCategory.displayName}-${statLabel}`;

  useEffect(() => {
    const labels = [MIN_YEAR, MAX_YEAR - 1, MAX_YEAR];
    let tableData = [];

    playerMainStatCategory.statistics.forEach((statCategory) => {
      if (
        statCategory.season.year >= MIN_YEAR &&
        statCategory.season.year <= MAX_YEAR
      ) {
        const idx = playerMainStatCategory.labels.indexOf(statLabel);
        if (idx !== -1) {
          tableData.push(Number(statCategory.stats[idx].replace(',', '')));
        }
      }
    });

    const numYearsCheck = MAX_YEAR - MIN_YEAR + 1;
    if (tableData.length !== numYearsCheck) {
      let missingYears = numYearsCheck - tableData.length;
      while (missingYears > 0) {
        tableData = [null].concat(tableData);
        missingYears--;
      }
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: `${playerMainStatCategory.displayName.toUpperCase()} ${statLabel}`,
          backgroundColor: lineColor.includes('fff') ? '#000' : lineColor,
          borderColor: lineColor.includes('fff') ? '#000' : lineColor,
          data: tableData,
        },
      ],
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    var myChart = new Chart(document.getElementById(chartId), config);
  }, []);
  //   myChart();
  return (
    <div className='col-md-6'>
      <canvas id={chartId}></canvas>
    </div>
  );
};

export default PlayerDetailLineChart;
