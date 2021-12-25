import {
  getBottomNavigationUtilityClass,
  stepButtonClasses,
} from '@mui/material';
import PlayersApi from '../api/PlayersApi';
import RankingsApi from '../api/RankingsApi';
// import playerMap from '../data';

export const players = {
  state: {
    players: null, //make null and check any where if null then make the api call
    tableData: null,
    compareIds: [],
    rankingsLists: null,
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setPlayers(state, payload) {
      console.log(payload);
      return { ...state, players: payload };
    },
    setCompareIds(state, payload) {
      return { ...state, compareIds: payload };
    },
    setRankingsLists(state, payload) {
      return { ...state, rankingsLists: payload };
    },
    setTableData(state, payload) {
      const tableData = {
        QB: payload.arrQB,
        RB: payload.arrRB,
        WR: payload.arrWR,
        TE: payload.arrTE,
      };
      return { ...state, tableData };
    },
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async setPlayersAsync(setIsLoading) {
      setIsLoading(true);
      const allPlayers = await PlayersApi.getPlayers();
      if (allPlayers) {
        this.setPlayers(allPlayers);
        this.setTableData(allPlayers);
      }
      setIsLoading(false);
    },
    async setRankingsListsAsync({ setIsLoading, userId }) {
      setIsLoading(true);
      const rankingsLists = await RankingsApi.getLists(userId);
      if (rankingsLists.length > 0) {
        this.setRankingsLists(rankingsLists);
      } else {
        this.setRankingsLists(null);
      }
      setIsLoading(false);
    },
    async addRankingsListsAsync({ setIsLoading, list }, state) {
      setIsLoading && setIsLoading(true);
      const newRankingsList = await RankingsApi.addList(list);
      if (newRankingsList) {
        // Add new lists to users lists in redux
        const lists = this.setRankingsLists(
          state.players.rankingsLists
            ? [...state.players.rankingsLists].concat(newRankingsList)
            : [newRankingsList]
        );
      }
      setIsLoading(false);
      return newRankingsList;
    },
  },
};
