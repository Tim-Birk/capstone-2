import PlayersApi from '../api/PlayersApi';
import playerMap from '../data';

export const players = {
  state: {
    players: null, //make null and check any where if null then make the api call
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setPlayers(state, payload) {
      console.log(payload);
      return { ...state, players: payload };
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async setPlayersAsync(payload, rootState) {
      const allPlayers = await PlayersApi.getPlayers();
      this.setPlayers(allPlayers);
    },
  }),
};
