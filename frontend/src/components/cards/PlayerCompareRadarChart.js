import { useEffect } from 'react';
import {
  getMetricLabels,
  getTableData,
  getPlayerStats,
  hexToRgba,
} from '../../helpers';
import Chart from 'chart.js/auto';

const PlayerCompareRadarChart = ({ position, playerA, playerB }) => {
  const playerAStats = getPlayerStats(playerA);
  const playerBStats = getPlayerStats(playerB);
  const lineAColor = playerA.currentTeam.color || 'rgb(255, 99, 132)';
  const lineBColor = playerB.currentTeam.color || 'rgb(255, 99, 132)';

  const chartId = `player-chart-${
    playerAStats.main ? playerAStats.main.displayName : ''
  }-${playerA.id}`;

  useEffect(() => {
    const labels = getMetricLabels(position, true);

    let tableAData = getTableData(
      position,
      playerAStats.main,
      playerAStats.alt,
      true
    );
    let tableBData = getTableData(
      position,
      playerBStats.main,
      playerBStats.alt,
      true
    );

    const data = {
      labels,
      datasets: [
        {
          label: playerA.shortName,
          backgroundColor: lineAColor.includes('fff')
            ? '#000'
            : hexToRgba(lineAColor, 0.5),
          borderColor: lineAColor.includes('fff') ? '#000' : lineAColor,
          data: tableAData,
        },
        {
          label: playerB.shortName,
          backgroundColor: lineBColor.includes('fff')
            ? '#000'
            : hexToRgba(lineBColor, 0.5),
          borderColor: lineBColor.includes('fff') ? '#000' : lineBColor,
          data: tableBData,
        },
      ],
    };

    const config = {
      type: 'radar',
      data: data,
      options: {
        elements: {
          line: {
            borderWidth: 2,
          },
        },
        scales: {
          r: {
            angleLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function (context) {
                return `${context[0].dataset.label.toUpperCase()}`;
              },
              label: function (context) {
                let label = context.label || '';

                if (label) {
                  label += ': ';
                }

                if (label.includes('TD')) {
                  return label + context.parsed.r / 100;
                } else {
                  return label + context.formattedValue;
                }
              },
            },
          },
        },
      },
    };
    var myChart = new Chart(document.getElementById(chartId), config);
  }, []);

  return (
    <>
      <div className='col-md-1'></div>
      <div className='col-md-10'>
        <canvas id={chartId}></canvas>
      </div>
      <div className='col-md-1'></div>
    </>
  );
};

export default PlayerCompareRadarChart;
