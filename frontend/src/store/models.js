import PlayersApi from '../api/PlayersApi';
import playerMap from '../data';

export const players = {
  state: {
    players: playerMap,
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setPlayers(state, payload) {
      return { ...payload };
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async setPlayersAsync(payload, rootState) {
      const allPlayers = await PlayersApi.getPlayers();
      dispatch.players.setPlayers(allPlayers);
    },
  }),
};
