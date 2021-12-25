import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { MAX_YEAR } from '../../helpers';
import PlayerCompareContainer from '../cards/PlayerCompareContainer';
import PlayerCompareMetrics from '../cards/PlayerCompareMetrics';
import PlayerCompareRadarChart from '../cards/PlayerCompareRadarChart';

const PlayerCompareModal = (props) => {
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const {
    players,
    className,
    modal,
    setModal,
    resetCompare,
    allPlayers,
    compareIds,
    position,
  } = props;

  useEffect(() => {
    try {
      setPlayerA(players[0]);
    } catch {}
    try {
      setPlayerB(players[1]);
    } catch {}
  }, [players]);

  const toggle = () => setModal(!modal);

  if (!playerA || !playerB) return null;

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      className={className}
      onClosed={resetCompare}
    >
      <ModalHeader toggle={toggle}>
        {position}: {playerA.displayName} vs. {playerB.displayName}
      </ModalHeader>
      <ModalBody>
        {!playerA || !playerB ? null : (
          <div>
            <div className='row compare-container'>
              <div className='col-6'>
                <PlayerCompareContainer player={playerA} />
              </div>
              <div className='col-6'>
                <PlayerCompareContainer player={playerB} />
              </div>
              <div>
                <h4 className='text-center my-4'>{MAX_YEAR} Comparison</h4>
              </div>
            </div>
            <div className='row mb-3'>
              <PlayerCompareRadarChart
                position={position}
                playerA={playerA}
                playerB={playerB}
              />
            </div>
            <PlayerCompareMetrics
              position={position}
              playerA={playerA}
              playerB={playerB}
            />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapState = (state) => {
  return {
    allPlayers: state.players,
    compareIds: state.players.compareIds,
  };
};

export default connect(mapState)(PlayerCompareModal);
