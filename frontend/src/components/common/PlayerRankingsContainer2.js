import React, { useState, useEffect } from 'react';

import { closest, POSITIONS, getAvailablePlayerMap } from '../../helpers';
import { Button } from 'reactstrap';
import RankingsApi from '../../api/RankingsApi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PlayerCompareModal from './PlayerCompareModal';
import CheatSheetTab from './CheatSheetTab';
import { IconButton } from '@mui/material';
import ProgressBar from './ProgressBar';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { connect } from 'react-redux';
import _ from 'lodash';
import './PlayerRankingsContainer2.css';

const PlayerRankingsContainer2 = ({
  listSetup,
  allPlayers,
  tableData,
  user,
}) => {
  const [loading, setLoading] = useState(true);
  const [compareData, setCompareData] = useState({
    position: null,
    playerIds: [],
    players: [],
  });
  const [rankingLists, setRankingLists] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [modal, setModal] = useState(false);
  const [cheatSheat, setCheatSheet] = useState(false);

  useEffect(async () => {
    // Get all players that will be available to the user based on list setup
    const availablePlayersMap = getAvailablePlayerMap(tableData, listSetup);
    setAvailablePlayers(availablePlayersMap);

    // Create initial rankings
    if (listSetup.isNew) {
      const playerLists = await RankingsApi.addPlayersList(
        availablePlayersMap,
        listSetup.id,
        user.id
      );
      setRankingLists(playerLists);

      setLoading(false);
    } else {
      const playerLists = await RankingsApi.getPlayersListByListId(
        listSetup.id
      );
      setRankingLists(playerLists);
      setLoading(false);
    }
  }, []);

  const handleOnDragStart = () => {
    setIsDragging(true);
  };

  const handleOnDragEnd = async (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    const { source, destination } = result;
    const position = source.droppableId;
    let positionList = [...rankingLists[position]];
    const items = Array.from(positionList);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    RankingsApi.addPlayersList(
      { [position]: items },
      listSetup.id,
      user.id,
      position
    );

    setRankingLists({
      ...rankingLists,
      [position]: items,
    });
  };

  const showCheatSheet = () => {
    setCheatSheet(true);
  };

  const handleCompareClick = (e) => {
    const playerId = closest(e.target, 'button')?.getAttribute('data-id');
    const position = closest(e.target, 'button')?.getAttribute('data-position');

    let playerIds = [...compareData.playerIds];
    let players = [...compareData.players];
    if (!playerId || playerIds.includes(playerId)) {
      return;
    }

    if (compareData.position !== position) {
      playerIds = [];
      players = [];
    }
    const player = allPlayers[POSITIONS[position].redux][playerId];
    playerIds.push(playerId);
    players.push(player);

    setCompareData({ position, playerIds, players });
    if (playerIds.length === 2) {
      setModal(true);
    }
  };

  const resetCompare = () => {
    setCompareData({ position: null, playerIds: [], players: [] });
  };

  const getPlayerLists = () => {
    if (!rankingLists) {
      return null;
    }
    const fullList = [];
    for (const position in POSITIONS) {
      const positionList = (
        <DragDropContext
          onDragStart={handleOnDragStart}
          onDragEnd={handleOnDragEnd}
          key={position}
        >
          <Droppable droppableId={position}>
            {(provided) => (
              <div
                key={position}
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='col-md-6 col-lg-3'
              >
                <h5 className='mt-2 mb-2'>{position}</h5>
                {rankingLists[position].map((player, index) => {
                  return (
                    <Draggable
                      key={player.id}
                      draggableId={player.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-3 pt-2 pb-3 player-rankings-card${
                            compareData.playerIds.includes(player.player_id)
                              ? ' compare-selected mt-2'
                              : ' mt-1'
                          }`}
                        >
                          {compareData.playerIds.includes(player.player_id) ? (
                            <div className='compare-msg px-1 mb-1'>
                              Compare{' '}
                              {POSITIONS[player.position].name
                                .toLowerCase()
                                .replace('s', '')}
                            </div>
                          ) : null}
                          <div className='d-flex align-items-end justify-content-between'>
                            <div className='d-flex align-items-end'>
                              {index + 1}.{' '}
                              <img
                                alt={
                                  allPlayers[POSITIONS[position].redux][
                                    Number(player.player_id)
                                  ].headshot.alt
                                }
                                src={
                                  allPlayers[POSITIONS[position].redux][
                                    Number(player.player_id)
                                  ].headshot.href
                                }
                                className='player-rankings-avatar mx-1 d-lg-none'
                              />
                              {player.player_name}
                              <img
                                alt={
                                  allPlayers[POSITIONS[position].redux][
                                    Number(player.player_id)
                                  ].currentTeam.abbreviation
                                }
                                src={
                                  allPlayers[POSITIONS[position].redux][
                                    Number(player.player_id)
                                  ].currentTeam.logo.href
                                }
                                className='player-rankings-team-logo mx-1'
                              />
                            </div>
                            <div className='compare-button-container'>
                              <IconButton
                                aria-label='delete'
                                className='mb-1'
                                onClick={handleCompareClick}
                                data-id={player.player_id}
                                data-position={player.position}
                                title='Click to compare player or drag to change ranking.'
                              >
                                <CompareArrowsIcon />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
      fullList.push(positionList);
    }

    return fullList;
  };

  if (loading) {
    return (
      <div className='mt-5'>
        <ProgressBar message='Loading rankings list...' />
      </div>
    );
  }

  return (
    <>
      {cheatSheat ? (
        <CheatSheetTab
          loading={loading}
          list={listSetup}
          activeList={rankingLists}
        />
      ) : (
        <div className='row'>
          <div className='d-flex align-items-center justify-content-between'>
            <h4 className='pt-1'>{listSetup.name}</h4>
            <div>
              <Button color='info' size='sm' onClick={showCheatSheet}>
                Cheat sheet
              </Button>
            </div>
          </div>
          {getPlayerLists()}

          <PlayerCompareModal
            modal={modal}
            position={compareData.position}
            players={[...compareData.players]}
            setModal={setModal}
            resetCompare={resetCompare}
          />
        </div>
      )}
    </>
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

export default connect(mapState, mapDispatch)(PlayerRankingsContainer2);
