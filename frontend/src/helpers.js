import RankingsApi from './api/RankingsApi';
import _ from 'lodash';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';
// const BASE_URL = 'https://fantasy-football-assistant.herokuapp.com';
const BASE_YEAR = new Date().getFullYear() - 1;
const MIN_YEAR = BASE_YEAR - 2;
const MAX_YEAR = BASE_YEAR;
const POSITION_OFFSET = 4; // number of extra players to rank beyond max # of players (based on list settings)

const POSITIONS = {
  QB: { name: 'Quarterbacks', redux: 'quarterbacks' },
  RB: { name: 'Running backs', redux: 'runningBacks' },
  WR: { name: 'Wide receivers', redux: 'wideReceivers' },
  TE: { name: 'Tight ends', redux: 'tightEnds' },
};

const AUTO_RANK_THRESHHOLDS = {
  QB: 12,
  RB: 15,
  WR: 15,
  TE: 10,
};

const getAvailablePlayerMap = (tableData, list) => {
  const availablePlayersMap = {};
  for (const position in POSITIONS) {
    const players = tableData[position].slice(
      0,
      list[`num_${position.toLowerCase()}s`] + POSITION_OFFSET
    );
    availablePlayersMap[position] = players;
  }
  return availablePlayersMap;
};

/**
 * Takes long position name and converts to short name
 * @param name (e.g. 'Quarterback')
 * @returns string (e.g. 'QB')
 */
const getPostionNameByValue = (name) => {
  // name needs to be pluralized to match to a key
  return Object.keys(POSITIONS).find(
    (key) => POSITIONS[key].name.toUpperCase() === `${name.toUpperCase()}S`
  );
};

const TABLE_COLUMNS = {
  QB: [
    {
      id: 'rank',
      numeric: true,
      disablePadding: true,
      label: 'Rank',
    },
    {
      id: 'player',
      numeric: false,
      disablePadding: false,
      label: 'Player',
    },
    {
      id: 'gamesPlayed',
      numeric: true,
      disablePadding: false,
      label: 'GP',
    },
    {
      id: 'passingAttempts',
      numeric: true,
      disablePadding: false,
      label: 'ATT',
    },
    {
      id: 'passingYards',
      numeric: true,
      disablePadding: false,
      label: 'PASS YDS',
    },
    {
      id: 'passingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'PASS TD',
    },
    {
      id: 'interceptions',
      numeric: true,
      disablePadding: false,
      label: 'INT',
    },
    {
      id: 'rushingYards',
      numeric: true,
      disablePadding: false,
      label: 'RUSH YDS',
    },
    {
      id: 'rushingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'RUSH TD',
    },
    {
      id: 'passingFumbles',
      numeric: true,
      disablePadding: false,
      label: 'FUM',
    },
  ],
  RB: [
    {
      id: 'rank',
      numeric: true,
      disablePadding: true,
      label: 'Rank',
    },
    {
      id: 'player',
      numeric: false,
      disablePadding: false,
      label: 'Player',
    },
    {
      id: 'gamesPlayed',
      numeric: true,
      disablePadding: false,
      label: 'GP',
    },
    {
      id: 'rushingAttempts',
      numeric: true,
      disablePadding: false,
      label: 'ATT',
    },
    {
      id: 'rushingYards',
      numeric: true,
      disablePadding: false,
      label: 'RUSH YDS',
    },
    {
      id: 'rushingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'RUSH TD',
    },
    {
      id: 'receptions',
      numeric: true,
      disablePadding: false,
      label: 'REC',
    },
    {
      id: 'receivingYards',
      numeric: true,
      disablePadding: false,
      label: 'REC YDS',
    },
    {
      id: 'receivingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'REC TD',
    },
    {
      id: 'rushingFumbles',
      numeric: true,
      disablePadding: false,
      label: 'FUM',
    },
  ],
  WR: [
    {
      id: 'rank',
      numeric: true,
      disablePadding: true,
      label: 'Rank',
    },
    {
      id: 'player',
      numeric: false,
      disablePadding: false,
      label: 'Player',
    },
    {
      id: 'gamesPlayed',
      numeric: true,
      disablePadding: false,
      label: 'GP',
    },
    {
      id: 'receptions',
      numeric: true,
      disablePadding: false,
      label: 'REC',
    },
    {
      id: 'receivingYards',
      numeric: true,
      disablePadding: false,
      label: 'REC YDS',
    },
    {
      id: 'receivingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'REC TD',
    },
    {
      id: 'rushingAttempts',
      numeric: true,
      disablePadding: false,
      label: 'RUSH ATT',
    },
    {
      id: 'rushingYards',
      numeric: true,
      disablePadding: false,
      label: 'RUSH YDS',
    },
    {
      id: 'rushingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'RUSH TD',
    },
    {
      id: 'receivingFumbles',
      numeric: true,
      disablePadding: false,
      label: 'FUM',
    },
  ],
  TE: [
    {
      id: 'rank',
      numeric: true,
      disablePadding: true,
      label: 'Rank',
    },
    {
      id: 'player',
      numeric: false,
      disablePadding: false,
      label: 'Player',
    },
    {
      id: 'gamesPlayed',
      numeric: true,
      disablePadding: false,
      label: 'GP',
    },
    {
      id: 'receptions',
      numeric: true,
      disablePadding: false,
      label: 'REC',
    },
    {
      id: 'receivingYards',
      numeric: true,
      disablePadding: false,
      label: 'REC YDS',
    },
    {
      id: 'receivingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'REC TD',
    },
    {
      id: 'rushingAttempts',
      numeric: true,
      disablePadding: false,
      label: 'RUSH ATT',
    },
    {
      id: 'rushingYards',
      numeric: true,
      disablePadding: false,
      label: 'RUSH YDS',
    },
    {
      id: 'rushingTouchdowns',
      numeric: true,
      disablePadding: false,
      label: 'RUSH TD',
    },
    {
      id: 'receivingFumbles',
      numeric: true,
      disablePadding: false,
      label: 'FUM',
    },
  ],
};

const THRESHHOLDS = {
  Quarterback: {
    main: [
      // Passing
      null, // GP
      { reverseCheck: false, good: 400, bad: 225 }, // CMP
      { reverseCheck: false, good: 600, bad: 350 }, // ATT
      { reverseCheck: false, good: 65, bad: 50 }, // CMP%
      { reverseCheck: false, good: 4000, bad: 2999 }, // YDS
      { reverseCheck: false, good: 7.5, bad: 4.5 }, // AVG
      { reverseCheck: false, good: 40, bad: 25 }, // TD
      { reverseCheck: true, good: 7, bad: 15 }, // INT
      { reverseCheck: false, good: 60, bad: 45 }, // LNG
      { reverseCheck: true, good: 20, bad: 30 }, // SACK
      { reverseCheck: true, good: 3, bad: 6 }, // FUM
      { reverseCheck: false, good: 88, bad: 79 }, // RTG
      { reverseCheck: false, good: 60, bad: 52 }, // QBR
    ],
    alt: [
      // Rushing
      null, // GP
      { reverseCheck: false, good: 100, bad: 0 }, // ATT
      { reverseCheck: false, good: 800, bad: 100 }, // YDS
      { reverseCheck: false, good: 4, bad: 3.4 }, // AVG
      { reverseCheck: false, good: 5, bad: -1 }, // TD
      { reverseCheck: false, good: 25, bad: 0 }, // LNG
      { reverseCheck: false, good: 20, bad: 0 }, // FD
      { reverseCheck: true, good: 4, bad: 9 }, // FUM
      { reverseCheck: true, good: 0, bad: 0 }, // LST
    ],
  },
  'Running Back': {
    main: [
      // Rushing
      null, // GP
      { reverseCheck: false, good: 250, bad: 0 }, // ATT
      { reverseCheck: false, good: 1000, bad: 400 }, // YDS
      { reverseCheck: false, good: 4, bad: 3.4 }, // AVG
      { reverseCheck: false, good: 10, bad: -1 }, // TD
      { reverseCheck: false, good: 50, bad: 0 }, // LNG
      { reverseCheck: false, good: 50, bad: 0 }, // FD
      { reverseCheck: true, good: 4, bad: 9 }, // FUM
      { reverseCheck: true, good: 0, bad: 0 }, // LST
    ],
    alt: [
      // Receiving
      null, // GP
      { reverseCheck: false, good: 40, bad: 0 }, // REC
      { reverseCheck: false, good: 60, bad: 0 }, // TGTS
      { reverseCheck: false, good: 500, bad: 0 }, // YDS
      { reverseCheck: false, good: 8.5, bad: -1 }, // AVG
      { reverseCheck: false, good: 4, bad: -1 }, // TD
      { reverseCheck: false, good: 65, bad: 0 }, // LNG
      { reverseCheck: false, good: 25, bad: 0 }, // FD
      { reverseCheck: true, good: 4, bad: 9 }, // FUM
      { reverseCheck: true, good: 0, bad: 0 }, // LST
    ],
  },
  'Wide Receiver': {
    main: [
      // Receiving
      null, // GP
      { reverseCheck: false, good: 80, bad: 50 }, // REC
      { reverseCheck: false, good: 150, bad: 80 }, // TGTS
      { reverseCheck: false, good: 1000, bad: 700 }, // YDS
      { reverseCheck: false, good: 10, bad: -1 }, // AVG
      { reverseCheck: false, good: 10, bad: 0 }, // TD
      { reverseCheck: false, good: 65, bad: 0 }, // LNG
      { reverseCheck: false, good: 50, bad: 0 }, // FD
      { reverseCheck: true, good: 4, bad: 9 }, // FUM
      { reverseCheck: true, good: 0, bad: 0 }, // LST
    ],
    alt: [
      // Rushing
      null, // GP
      { reverseCheck: false, good: 100, bad: 0 }, // ATT
      { reverseCheck: false, good: 800, bad: 100 }, // YDS
      { reverseCheck: false, good: 4, bad: 3.4 }, // AVG
      { reverseCheck: false, good: 5, bad: -1 }, // TD
      { reverseCheck: false, good: 25, bad: 0 }, // LNG
      { reverseCheck: false, good: 20, bad: 0 }, // FD
      { reverseCheck: true, good: 4, bad: 9 }, // FUM
      { reverseCheck: true, good: 0, bad: 0 }, // LST
    ],
  },
  'Tight End': {
    main: [
      // Receiving
      null, // GP
      { reverseCheck: false, good: 80, bad: 50 }, // REC
      { reverseCheck: false, good: 150, bad: 80 }, // TGTS
      { reverseCheck: false, good: 1000, bad: 700 }, // YDS
      { reverseCheck: false, good: 10, bad: -1 }, // AVG
      { reverseCheck: false, good: 10, bad: 0 }, // TD
      { reverseCheck: false, good: 65, bad: 0 }, // LNG
      { reverseCheck: false, good: 50, bad: 0 }, // FD
      { reverseCheck: true, good: 4, bad: 9 }, // FUM
      { reverseCheck: true, good: 0, bad: 0 }, // LST
    ],
    alt: [
      // Rushing
      null, // GP
      { reverseCheck: false, good: 100, bad: 0 }, // ATT
      { reverseCheck: false, good: 800, bad: 100 }, // YDS
      { reverseCheck: false, good: 4, bad: 3.4 }, // AVG
      { reverseCheck: false, good: 5, bad: -1 }, // TD
      { reverseCheck: false, good: 25, bad: 0 }, // LNG
      { reverseCheck: false, good: 20, bad: 0 }, // FD
      { reverseCheck: true, good: 4, bad: 9 }, // FUM
      { reverseCheck: true, good: 0, bad: 0 }, // LST
    ],
  },
};

const METRICS = {
  QB: [
    {
      displayName: 'Passing',
      key: 'YDS',
      label: 'PASS YDS',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Passing',
      key: 'TD',
      label: 'PASS TD',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Passing',
      key: 'ATT',
      label: 'PASS ATT',
      type: 'main',
      isRadar: false,
    },
    {
      displayName: 'Passing',
      key: 'CMP%',
      label: 'COMPLETION %',
      type: 'main',
      isRadar: false,
    },
    {
      displayName: 'Passing',
      key: 'INT',
      label: 'INTERCEPTIONS',
      type: 'main',
      isRadar: false,
      isInverse: true,
    },
    {
      displayName: 'Rushing',
      key: 'YDS',
      label: 'RUSH YDS',
      type: 'alt',
      isRadar: true,
    },
    {
      displayName: 'Rushing',
      key: 'TD',
      label: 'RUSH TD',
      type: 'alt',
      isRadar: true,
    },
  ],
  RB: [
    {
      displayName: 'Rushing',
      key: 'YDS',
      label: 'RUSH YDS',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Rushing',
      key: 'TD',
      label: 'RUSH TD',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Rushing',
      key: 'ATT',
      label: 'RUSH ATT',
      type: 'main',
      isRadar: false,
    },
    {
      displayName: 'Receiving',
      key: 'YDS',
      label: 'REC YDS',
      type: 'alt',
      isRadar: true,
    },
    {
      displayName: 'Receiving',
      key: 'YDS',
      label: 'REC TD',
      type: 'alt',
      isRadar: true,
    },
    {
      displayName: 'Receiving',
      key: 'REC',
      label: 'RECEPTIONS',
      type: 'alt',
      isRadar: false,
    },
  ],
  WR: [
    {
      displayName: 'Receiving',
      key: 'YDS',
      label: 'REC YDS',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Receiving',
      key: 'TD',
      label: 'REC TD',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Receiving',
      key: 'REC',
      label: 'RECEPTIONS',
      type: 'main',
      isRadar: false,
    },
    {
      displayName: 'Rushing',
      key: 'YDS',
      label: 'RUSH YDS',
      type: 'alt',
      isRadar: true,
    },
    {
      displayName: 'Rushing',
      key: 'TD',
      label: 'RUSH TD',
      type: 'alt',
      isRadar: true,
    },
    {
      displayName: 'Rushing',
      key: 'ATT',
      label: 'RUSH ATT',
      type: 'alt',
      isRadar: false,
    },
  ],
  TE: [
    {
      displayName: 'Receiving',
      key: 'YDS',
      label: 'REC YDS',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Receiving',
      key: 'TD',
      label: 'REC TD',
      type: 'main',
      isRadar: true,
    },
    {
      displayName: 'Receiving',
      key: 'REC',
      label: 'RECEPTIONS',
      type: 'main',
      isRadar: false,
    },
    {
      displayName: 'Rushing',
      key: 'YDS',
      label: 'RUSH YDS',
      type: 'alt',
      isRadar: true,
    },
    {
      displayName: 'Rushing',
      key: 'TD',
      label: 'RUSH TD',
      type: 'alt',
      isRadar: true,
    },
    {
      displayName: 'Rushing',
      key: 'ATT',
      label: 'RUSH ATT',
      type: 'alt',
      isRadar: false,
    },
  ],
};

const getTableData = (
  position,
  playerMainStatCategory,
  playerAltStatCategory,
  isRadar
) => {
  let tableData = [];
  if (!playerMainStatCategory || !playerAltStatCategory) {
    return tableData;
  }
  // Get current year for main and alt stat categories
  let currentMain, currentAlt;
  for (let i = playerMainStatCategory.statistics.length - 1; i >= 0; i--) {
    const statCategory = playerMainStatCategory.statistics[i];
    if (statCategory.season.year === MAX_YEAR) {
      currentMain = statCategory;
      break;
    }
  }
  for (let i = playerAltStatCategory.statistics.length - 1; i >= 0; i--) {
    const statCategory = playerAltStatCategory.statistics[i];
    if (statCategory.season.year === MAX_YEAR) {
      currentAlt = statCategory;
      break;
    }
  }

  // Get relevant metric labels and values
  METRICS[position].forEach((metric) => {
    const labelArray =
      metric.type === 'main' ? playerMainStatCategory : playerAltStatCategory;
    const statCategory = metric.type === 'main' ? currentMain : currentAlt;

    const idx = labelArray.labels.indexOf(metric.key);
    if (idx !== -1 && statCategory && !(isRadar && !metric.isRadar)) {
      tableData.push(
        metric.key === 'TD'
          ? statCategory.stats[idx] * 100
          : Number(statCategory.stats[idx].replace(',', ''))
      );
    }
  });

  return tableData;
};

const getMetricLabels = (position, isRadar) => {
  const labels = [];
  METRICS[position].forEach((metric) => {
    if (!(isRadar && !metric.isRadar)) {
      labels.push(metric.label);
    }
  });
  return labels;
};

const getPlayerStats = (player) => {
  return { main: player.statCategories[0], alt: player.statCategories[1] };
};

const hexToRgba = (hex, opacity) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${opacity})`
    : null;
};

const doesComparisonExist = async (winningPlayerId, losingPlayerId, listId) => {
  const comparisonKey = createComparisonKey(
    winningPlayerId,
    losingPlayerId,
    listId
  );
  const rankingComparison = await RankingsApi.getComparisonsByComparisonKey(
    comparisonKey
  );
  return _.toArray(rankingComparison).length > 0;
};

const createComparison = (
  winner_id,
  loser_id,
  list_id,
  user_id,
  winner_name,
  loser_name,
  position
) => {
  const comparisonKey = createComparisonKey(winner_id, loser_id, list_id);
  const manualComparison = {
    list_id,
    user_id,
    comparisonKey,
    winner_id,
    loser_id,
    winner_name,
    loser_name,
    position,
  };

  return manualComparison;
};

const createComparisonKey = (winner_id, loser_id, list_id) => {
  return `${winner_id}~${loser_id}~${list_id}`;
};

const closest = (el, selector) => {
  var matchesFn;

  // find vendor prefix
  [
    'matches',
    'webkitMatchesSelector',
    'mozMatchesSelector',
    'msMatchesSelector',
    'oMatchesSelector',
  ].some(function (fn) {
    if (typeof document.body[fn] == 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  });

  var parent;

  // traverse parents
  while (el) {
    parent = el.parentElement;
    if (parent && parent[matchesFn](selector)) {
      return parent;
    }
    el = parent;
  }

  return null;
};

export {
  BASE_URL,
  AUTO_RANK_THRESHHOLDS,
  TABLE_COLUMNS,
  POSITIONS,
  POSITION_OFFSET,
  BASE_YEAR,
  MIN_YEAR,
  MAX_YEAR,
  THRESHHOLDS,
  getPostionNameByValue,
  getTableData,
  METRICS,
  getMetricLabels,
  getPlayerStats,
  hexToRgba,
  getAvailablePlayerMap,
  doesComparisonExist,
  createComparison,
  createComparisonKey,
  closest,
};
