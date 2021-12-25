import { MIN_YEAR, MAX_YEAR, THRESHHOLDS } from '../../helpers';
import './PlayerDetailHistoryTable.css';

const PlayerDetailHistoryTable = ({
  player,
  playerMainStatCategory,
  statType,
}) => {
  return (
    <div className='detail history-container row mt-2'>
      <h4 className='detail table-title'>
        {playerMainStatCategory.displayName}
      </h4>
      <table>
        <thead>
          <tr>
            <td key='YEAR'>YEAR</td>
            {playerMainStatCategory.labels.map((label, idx) => {
              return <td key={label}>{label}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          {[...playerMainStatCategory.statistics]
            .reverse()
            .map((statCategory) => {
              if (
                statCategory.season.year >= MIN_YEAR &&
                statCategory.season.year <= MAX_YEAR
              ) {
                return (
                  <tr>
                    <td key={999}>{statCategory.season.year}</td>
                    {statCategory.stats.map((stat, idx) => {
                      const numStat = Number(stat.replace(',', ''));
                      let colorClass = '';
                      if (THRESHHOLDS[player.position][statType][idx]) {
                        if (
                          THRESHHOLDS[player.position][statType][idx]
                            .reverseCheck
                        ) {
                          if (
                            numStat <=
                            THRESHHOLDS[player.position][statType][idx].good
                          ) {
                            colorClass = 'text-success';
                          } else if (
                            numStat >=
                            THRESHHOLDS[player.position][statType][idx].bad
                          ) {
                            colorClass = 'text-danger';
                          }
                        } else {
                          if (
                            numStat >=
                            THRESHHOLDS[player.position][statType][idx].good
                          ) {
                            colorClass = 'text-success';
                          } else if (
                            numStat <=
                            THRESHHOLDS[player.position][statType][idx].bad
                          ) {
                            colorClass = 'text-danger';
                          }
                        }
                      }
                      return (
                        <td className={colorClass} key={idx}>
                          {stat}
                        </td>
                      );
                    })}
                  </tr>
                );
              } else {
                return null;
              }
            })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerDetailHistoryTable;
