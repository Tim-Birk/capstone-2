import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import UserContext from '../../contexts/UserContext';
import './PlayerDetailPage.css';

const PlayerDetailPage = ({ getAllPlayers }) => {
  const { position, id } = useParams();
  const { user } = useContext(UserContext);
  const [player, setPlayer] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // if (!user) {
    //   history.push('/login');
    // }
    const allPlayers = getAllPlayers();
    setPlayer(allPlayers[position][id]);
  }, [player]);

  if (!player) return <h1>Not found</h1>;
  return (
    <Container>
      <h2>{player.displayName}</h2>
      <img src={player.headshot['href']} alt={player.headshot['alt']} />
    </Container>
  );
};

const mapDispatch = (dispatch) => {
  return {
    getAllPlayers: () => dispatch.players.players,
  };
};

export default connect(mapDispatch)(PlayerDetailPage);
