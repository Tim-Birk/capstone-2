import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import UserContext from '../../contexts/UserContext';
import PlayerDetailHeader from '../cards/PlayerDetailHeader';
import PlayerDetailInjuryNews from '../cards/PlayerDetailInjuryNews';
import PlayerDetailHistoryTable from '../cards/PlayerDetailHistoryTable';
import PlayerDetailLineChart from '../cards/PlayerDetailLineChart';
import ErrorAlert from '../common/ErrorAlert';
import Spinner from '../common/Spinner';
import './PlayerDetailPage.css';

const PlayerDetailPage = ({ allPlayers }) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const { position, id } = useParams();
  const [player, setPlayer] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // if (!user) {
    //   history.push('/login');
    // }
    // const allPlayers = getAllPlayers();
    if (allPlayers) {
      setPlayer(allPlayers.players[position][id]);
      setIsLoading(false);
    }
  }, [allPlayers, player, user]);

  if (isLoading) return <Spinner />;
  if (!player)
    return (
      <div className='mt-3'>
        <ErrorAlert
          isHidden={false}
          msg={'Player not found.'}
          setErrorMsg={setErrorMsg}
        />
      </div>
    );

  const playerMainStatCategory = player.statCategories[0];
  const playerAltStatCategory = player.statCategories[1];
  if (!playerMainStatCategory)
    return (
      <div className='mt-3'>
        <ErrorAlert
          className='mt-3'
          isHidden={false}
          msg={'No data available for this player.'}
          setErrorMsg={setErrorMsg}
        />
      </div>
    );
  return (
    <Container>
      <PlayerDetailHeader player={player} />
      <PlayerDetailInjuryNews player={player} />

      <PlayerDetailHistoryTable
        player={player}
        playerMainStatCategory={playerMainStatCategory}
        statType='main'
      />
      {player.position === 'Tight End' ? null : (
        <PlayerDetailHistoryTable
          player={player}
          playerMainStatCategory={playerAltStatCategory}
          statType='alt'
        />
      )}
      <div className='chart-container row mt-2'>
        <PlayerDetailLineChart
          player={player}
          statLabel='YDS'
          playerMainStatCategory={playerMainStatCategory}
          lineColor={`#${player.currentTeam.color}`}
        />
        <PlayerDetailLineChart
          player={player}
          statLabel='TD'
          playerMainStatCategory={playerMainStatCategory}
          lineColor={`#${player.currentTeam.alternateColor}`}
        />
      </div>
      {player.position === 'Tight End' ? null : (
        <div className='chart-container row mt-2 '>
          <PlayerDetailLineChart
            player={player}
            statLabel='YDS'
            playerMainStatCategory={playerAltStatCategory}
            lineColor={`#${player.currentTeam.color}`}
          />
          <PlayerDetailLineChart
            player={player}
            statLabel='TD'
            playerMainStatCategory={playerAltStatCategory}
            lineColor={`#${player.currentTeam.alternateColor}`}
          />
        </div>
      )}
      {player.position !== 'Quarterback' ? null : (
        <div className='chart-container row mt-2 '>
          <PlayerDetailLineChart
            player={player}
            statLabel='ATT'
            playerMainStatCategory={playerMainStatCategory}
            lineColor={`#${player.currentTeam.color}`}
          />
          <PlayerDetailLineChart
            player={player}
            statLabel='CMP'
            playerMainStatCategory={playerMainStatCategory}
            lineColor={`#${player.currentTeam.alternateColor}`}
          />
        </div>
      )}
    </Container>
  );
};

const mapState = (state) => {
  return {
    allPlayers: state.players,
  };
};

export default connect(mapState)(PlayerDetailPage);
