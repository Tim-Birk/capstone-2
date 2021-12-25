import { useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import PlayerRankingsTabCard from './PlayerRankingsTabCard';
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
}) => {
  useEffect(() => {
    console.log('tab use effect');
  }, []);
  // if (!playerA || !playerB) return null;
  const handlePlayerAPick = () => {
    advanceNextPick(playerA, playerB);
  };
  const handlePlayerBPick = () => {
    advanceNextPick(playerB, playerA);
  };
  return (
    <div className='rankings-tab-container'>
      <h3 className='pt-3 px-3 mx-auto mx-md-0'>
        {name}: {POSITIONS[position].name}
      </h3>
      <Row>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {!isComplete && (
              <Col md={8}>
                <Row className='players-container mt-3'>
                  <Col className='player-container' xs={6}>
                    <PlayerRankingsTabCard player={playerA} />
                    <Button
                      className='pick-button'
                      color='primary'
                      onClick={handlePlayerAPick}
                    >
                      Pick
                    </Button>
                  </Col>
                  <Col className='player-container' xs={6}>
                    <PlayerRankingsTabCard player={playerB} />
                    <Button
                      className='pick-button text-center'
                      color='primary'
                      onClick={handlePlayerBPick}
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
        )}
      </Row>
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
