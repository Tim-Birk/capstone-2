import _ from 'lodash';

const BASE_YEAR = new Date().getFullYear() - 1;

const POSITIONS = {
  QB: 'Quarterbacks',
  RB: 'Running backs',
  WR: 'Wide receivers',
  TE: 'Tight ends',
};

const COLUMNS = {
  QB: [
    { title: 'Rank', field: 'rank' },
    {
      title: 'Player',
      field: 'player',
      render: (rowData) => <a href='#'>{rowData.player}</a>,
    },
    { title: 'GP', field: 'gamesPlayed' },
    //   { title: 'CMP', field: 'completions' },
    { title: 'ATT', field: 'passingAttempts' },
    //   { title: 'CMP%', field: 'completionPct' },
    { title: 'PASS YDS', field: 'passingYards' },
    //   { title: 'AVG', field: 'yardsPerPassAttempt' },
    { title: 'PASS TD', field: 'passingTouchdowns' },
    { title: 'INT', field: 'interceptions' },
    { title: 'RUSH YDS', field: 'rushingYards' },
    { title: 'RUSH TD', field: 'rushingTouchdowns' },
    //   { title: 'SACK', field: 'sacks' },
    { title: 'FUM', field: 'passingFumbles' },
    //   { title: 'QBR', field: 'adjQBR' },
  ],
  RB: [
    { title: 'Rank', field: 'rank' },
    {
      title: 'Player',
      field: 'player',
      render: (rowData) => <a href='#'>{rowData.player}</a>,
    },
    { title: 'GP', field: 'gamesPlayed' },
    { title: 'ATT', field: 'rushingAttempts' },
    { title: 'RUSH YDS', field: 'rushingYards' },
    { title: 'RUSH TD', field: 'rushingTouchdowns' },
    { title: 'REC', field: 'receptions' },
    { title: 'REC YDS', field: 'receivingYards' },
    { title: 'REC TD', field: 'receivingTouchdowns' },
    { title: 'FUM', field: 'rushingFumbles' },
  ],
  WR: [
    { title: 'Rank', field: 'rank' },
    {
      title: 'Player',
      field: 'player',
      render: (rowData) => <a href='#'>{rowData.player}</a>,
    },
    { title: 'GP', field: 'gamesPlayed' },
    { title: 'REC', field: 'receptions' },
    { title: 'REC YDS', field: 'receivingYards' },
    { title: 'REC TD', field: 'receivingTouchdowns' },
    { title: 'RUSH ATT', field: 'rushingAttempts' },
    { title: 'RUSH YDS', field: 'rushingYards' },
    { title: 'RUSH TD', field: 'rushingTouchdowns' },
    { title: 'FUM', field: 'receivingFumbles' },
  ],
  TE: [
    { title: 'Rank', field: 'rank' },
    {
      title: 'Player',
      field: 'player',
      render: (rowData) => <a href='#'>{rowData.player}</a>,
    },
    { title: 'GP', field: 'gamesPlayed' },
    { title: 'REC', field: 'receptions' },
    { title: 'REC YDS', field: 'receivingYards' },
    { title: 'REC TD', field: 'receivingTouchdowns' },
    { title: 'RUSH ATT', field: 'rushingAttempts' },
    { title: 'RUSH YDS', field: 'rushingYards' },
    { title: 'RUSH TD', field: 'rushingTouchdowns' },
    { title: 'FUM', field: 'receivingFumbles' },
  ],
};

const getTableData = (allPlayers, position, year = BASE_YEAR) => {
  const arrPlayers = [];
  if (position === 'QB') {
    for (const [key, player] of Object.entries(allPlayers.quarterbacks)) {
      const tablePlayer = {
        player: `${player.displayName} - ${player.currentTeam.abbreviation}`,
        overallRanking: Number(player.overallRanking),
      };

      if (player.statCategories.length) {
        const passingStats = player.statCategories[0]['statistics'];
        const rushingStats = player.statCategories[1]['statistics'];

        for (let i = passingStats.length - 1; i >= 0; i--) {
          const passingYear = passingStats[i];

          if (passingYear.season.year === year) {
            tablePlayer.gamesPlayed = Number(passingYear.stats[0]);
            tablePlayer.completions = Number(passingYear.stats[1]);
            tablePlayer.passingAttempts = Number(passingYear.stats[2]);
            tablePlayer.completionPct = Number(passingYear.stats[3]);
            tablePlayer.passingYards = Number(
              passingYear.stats[4].replace(',', '')
            );
            tablePlayer.yardsPerPassAttempt = Number(passingYear.stats[5]);
            tablePlayer.passingTouchdowns = Number(passingYear.stats[6]);
            tablePlayer.interceptions = Number(passingYear.stats[7]);
            tablePlayer.sacks = Number(passingYear.stats[10]);
            tablePlayer.passingFumbles = Number(passingYear.stats[11]);
            tablePlayer.adjQBR = Number(
              passingYear.stats[12].replace('-', '0')
            );
            break;
          }
        }
        for (let i = rushingStats.length - 1; i >= 0; i--) {
          const rushingYear = rushingStats[i];
          if (rushingYear.season.year === year) {
            tablePlayer.rushingYards = Number(
              rushingYear.stats[2].replace(',', '')
            );
            tablePlayer.rushingTouchdowns = Number(rushingYear.stats[4]);
            break;
          }
        }
        console.log(player.displayName, passingStats, rushingStats);
      } else {
        tablePlayer.gamesPlayed = 0;
        tablePlayer.completions = 0;
        tablePlayer.passingAttempts = 0;
        tablePlayer.completionPct = 0;
        tablePlayer.yardsPerPassAttempt = 0;
        tablePlayer.passingTouchdowns = 0;
        tablePlayer.interceptions = 0;
        tablePlayer.rushingYards = 0;
        tablePlayer.rushingTouchdowns = 0;
        tablePlayer.sacks = 0;
        tablePlayer.passingFumbles = 0;
        tablePlayer.adjQBR = 0;
      }
      arrPlayers.push(tablePlayer);
    }
  } else if (position === 'RB') {
    for (const [key, player] of Object.entries(allPlayers.runningBacks)) {
      const tablePlayer = {
        player: `${player.displayName} - ${player.currentTeam.abbreviation}`,
        overallRanking: Number(player.overallRanking),
      };

      if (player.statCategories.length) {
        const rushingStats = player.statCategories[0]['statistics'];
        const receivingStats = player.statCategories[1]
          ? player.statCategories[1]['statistics']
          : [];

        for (let i = rushingStats.length - 1; i >= 0; i--) {
          const rushingYear = rushingStats[i];

          if (rushingYear.season.year === year) {
            tablePlayer.gamesPlayed = Number(rushingYear.stats[0]);
            tablePlayer.rushingAttempts = Number(rushingYear.stats[1]);
            tablePlayer.rushingYards = Number(
              rushingYear.stats[2].replace(',', '')
            );
            tablePlayer.rushingTouchdowns = Number(rushingYear.stats[4]);
            tablePlayer.rushingFumbles = Number(rushingYear.stats[7]);
            break;
          }
        }
        for (let i = receivingStats.length - 1; i >= 0; i--) {
          const receivingYear = receivingStats[i];
          tablePlayer.receptions = Number(receivingYear.stats[1]);
          if (receivingYear.season.year === year) {
            tablePlayer.receivingYards = Number(
              receivingYear.stats[3].replace(',', '')
            );
            tablePlayer.receivingTouchdowns = Number(receivingYear.stats[5]);
            break;
          }
        }
      } else {
        tablePlayer.gamesPlayed = 0;
        tablePlayer.rushingAttempts = 0;
        tablePlayer.rushingYards = 0;
        tablePlayer.rushingTouchdowns = 0;
        tablePlayer.receptions = 0;
        tablePlayer.receivingYards = 0;
        tablePlayer.receivingTouchdowns = 0;
        tablePlayer.rushingFumbles = 0;
      }

      arrPlayers.push(tablePlayer);
    }
  } else if (position === 'WR' || position === 'TE') {
    for (const [key, player] of Object.entries(
      position === 'WR' ? allPlayers.wideReceivers : allPlayers.tightEnds
    )) {
      const tablePlayer = {
        player: `${player.displayName} - ${player.currentTeam.abbreviation}`,
        overallRanking: Number(player.overallRanking),
      };

      if (player.statCategories.length) {
        const receivingStats = player.statCategories[0]['statistics'];
        const rushingStats = player.statCategories[1]
          ? player.statCategories[1]['statistics']
          : [];

        for (let i = receivingStats.length - 1; i >= 0; i--) {
          const receivingYear = receivingStats[i];
          tablePlayer.gamesPlayed = Number(receivingYear.stats[0]);
          tablePlayer.receptions = Number(receivingYear.stats[1]);
          if (receivingYear.season.year === year) {
            tablePlayer.receivingYards = Number(
              receivingYear.stats[3].replace(',', '')
            );
            tablePlayer.receivingTouchdowns = Number(receivingYear.stats[5]);
            tablePlayer.receivingFumbles = Number(receivingYear.stats[7]);
            break;
          }
        }
        for (let i = rushingStats.length - 1; i >= 0; i--) {
          const rushingYear = rushingStats[i];

          if (rushingYear.season.year === year) {
            tablePlayer.rushingAttempts = Number(rushingYear.stats[1]);
            tablePlayer.rushingYards = Number(
              rushingYear.stats[2].replace(',', '')
            );
            tablePlayer.rushingTouchdowns = Number(rushingYear.stats[4]);
            break;
          }
        }
      } else {
        tablePlayer.gamesPlayed = 0;
        tablePlayer.rushingAttempts = 0;
        tablePlayer.rushingYards = 0;
        tablePlayer.rushingTouchdowns = 0;
        tablePlayer.receptions = 0;
        tablePlayer.receivingYards = 0;
        tablePlayer.receivingTouchdowns = 0;
        tablePlayer.rushingFumbles = 0;
      }

      arrPlayers.push(tablePlayer);
    }
  }

  const arrPlayersSorted = _.sortBy(arrPlayers, 'overallRanking').map(
    (player, idx) => ({
      ...player,
      rank: idx + 1,
    })
  );
  return arrPlayersSorted;
};

export { COLUMNS, getTableData, POSITIONS };
