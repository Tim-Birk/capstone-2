import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import UserContext from './UserContext';
import { Container } from 'reactstrap';
import Spinner from './Spinner';
import PlayersApi from './api/PlayersApi';

const PlayerStatsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playerList, setPlayerList] = useLocalStorage('playerList');
  const [players, setPlayers] = useState();
  const { user } = useContext(UserContext);
  const history = useHistory();

  async function getPlayers() {
    if (user) {
      if (!playerList) {
        let allPlayers = await PlayersApi.getPlayers();
        setPlayerList(JSON.stringify(allPlayers));
        setPlayers(allPlayers);
      } else {
        setPlayers(JSON.parse(playerList));
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    // Load companies from database and set global state for each array
    getPlayers();
  }, [user, history]);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1>Player Stats Page</h1>
    </div>
  );
};

export default PlayerStatsPage;
