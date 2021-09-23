import PlayersApi from '../api/PlayersApi';
import playerMap from '../data';

export const players = {
  state: {
    //  your api response. incase you need to access source of truth
    players: null, //make null and check any where if null then make the api call
    /* 
    qbs:
    wr:
    wrTableData
    */
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setPlayers(state, payload) {
      return { ...state, players: payload };
    },
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    // async calls in `effect` obj can only be one argument as an obj
    async setPlayersAsync() {
      console.log('players api call !!!')
      // check that response is valid
      const allPlayers = await PlayersApi.getPlayers();
      this.setPlayers(allPlayers);
    },
  },
};
