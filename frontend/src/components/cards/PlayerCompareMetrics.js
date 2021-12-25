import {
  getTableData,
  getPlayerStats,
  getMetricLabels,
  METRICS,
} from '../../helpers';
import PlayerCompareMetric from './PlayerCompareMetric';
const PlayerCompareMetrics = ({ position, playerA, playerB, metric }) => {
  const playerAStats = getPlayerStats(playerA);
  const playerBStats = getPlayerStats(playerB);
  const labels = getMetricLabels(position, false);
  let tableAData = getTableData(
    position,
    playerAStats.main,
    playerAStats.alt,
    false
  );
  let tableBData = getTableData(
    position,
    playerBStats.main,
    playerBStats.alt,
    false
  );

  return labels.map((label, idx) => {
    return (
      <PlayerCompareMetric
        label={label}
        statA={tableAData[idx]}
        statB={tableBData[idx]}
        isInverse={METRICS[position][idx].isInverse}
      />
    );
  });
};

export default PlayerCompareMetrics;
