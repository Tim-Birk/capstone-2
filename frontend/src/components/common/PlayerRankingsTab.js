import { useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import PlayerRankingsTabCard from './PlayerRankingsTabCard';
import LinearProgress from '@mui/material/LinearProgress';
import Spinner from './Spinner';
import { POSITIONS } from '../../helpers';
import { connect } from 'react-redux';
import _ from 'lodash';
import './PlayerRankingsTab.css';

const PlayerRankingsTab = ({
  playerA,
  playerB,
  advanceNextPick,
  setModal,
  positionResults,
  isComplete,
  name,
  position,
  loading,
  progress,
}) => {
  useEffect(() => {
    console.log('tab use effect');
  }, []);
  const handlePlayerAPick = () => {
    advanceNextPick(playerA, playerB);
  };
  const handlePlayerBPick = () => {
    advanceNextPick(playerB, playerA);
  };
  return (
    <div className='rankings-tab-container'>
      {progress !== 0 && progress !== 100 ? (
        <div className='mx-4 mx-md-auto mt-5'>
          <p className='text-center'>Preparing initial player lists...</p>
          <LinearProgress variant='determinate' value={progress} />
        </div>
      ) : (
        <>
          <h3 className='pt-3 px-3 mx-auto mx-md-0'>
            {name}: {POSITIONS[position].name}
          </h3>
          <Row>
            <>
              {!isComplete && (
                <Col md={8}>
                  <Row className='players-container mt-3'>
                    <Col className='player-container' xs={6}>
                      {loading ? (
                        <Spinner />
                      ) : (
                        <PlayerRankingsTabCard player={playerA} />
                      )}
                      <Button
                        className='pick-button'
                        color='primary'
                        onClick={handlePlayerAPick}
                        disabled={loading}
                      >
                        Pick
                      </Button>
                    </Col>
                    <Col className='player-container' xs={6}>
                      {loading ? (
                        <Spinner />
                      ) : (
                        <PlayerRankingsTabCard player={playerB} />
                      )}
                      <Button
                        className='pick-button text-center'
                        color='primary'
                        onClick={handlePlayerBPick}
                        disabled={loading}
                      >
                        Pick
                      </Button>
                    </Col>
                  </Row>
                  <div className=' text-center'>
                    <Button
                      className='mt-5 pick-button'
                      color='info'
                      onClick={() => setModal(true)}
                      disabled={loading}
                    >
                      Compare players
                    </Button>
                  </div>
                </Col>
              )}
              <Col md={isComplete ? 12 : 4}>
                <div className={`mt-5 d-flex flex-column align-items-center`}>
                  <h5>
                    Results{' '}
                    {isComplete ? (
                      <span className='text-success'>(complete)</span>
                    ) : (
                      <span className='text-danger'>(in-progress)</span>
                    )}
                    :
                  </h5>
                  <ol>
                    {positionResults.map((result) => (
                      <li>{result.player_name}</li>
                    ))}
                  </ol>
                </div>
              </Col>
            </>
          </Row>
        </>
      )}
    </div>
  );
};

const mapDispatch = (dispatch) => {
  return {};
};

const mapState = (state) => {
  return {
    allPlayers: state.players.players,
    tableData: state.players.tableData,
  };
};

export default connect(mapState, mapDispatch)(PlayerRankingsTab);
