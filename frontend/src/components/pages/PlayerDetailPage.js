import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container } from 'reactstrap';
import PlayersContext from '../../contexts/PlayersContext';
import UserContext from '../../contexts/UserContext';
import './PlayerDetailPage.css';

const PlayerDetailPage = () => {
  const { position, id } = useParams();
  const { user } = useContext(UserContext);
  const { playerMap } = useContext(PlayersContext);
  const [player, setPlayer] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    setPlayer(playerMap[position][id]);
  }, [player]);

  return (
    <Container>
      <h2>{player.displayName}</h2>
      {/* <img src={player.headshot['href']} alt={player.headshot['alt']} /> */}
    </Container>
  );
};

export default PlayerDetailPage;
