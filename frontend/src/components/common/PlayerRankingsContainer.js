import React, { useState, useEffect } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import {
  POSITIONS,
  getAvailablePlayerMap,
  doesComparisonExist,
  POSITION_OFFSET,
  AUTO_RANK_THRESHHOLDS,
} from '../../helpers';
import RankingsApi from '../../api/RankingsApi';
import PlayerRankingsTab from './PlayerRankingsTab';
import PlayerCompareModal from './PlayerCompareModal';
import CheatSheetTab from './CheatSheetTab';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';
import { permutations } from 'mathjs';
import './PlayerRankingsContainer.css';

const PlayerRankingsContainer = ({
  listSetup,
  allPlayers,
  tableData,
  user,
}) => {
  const [activeTab, setActiveTab] = useState('QB');
  const [loading, setLoading] = useState(true);
  const [activeList, setActiveList] = useState({
    QB: {
      playerA: null,
      playerB: null,
      consecutivePicks: 0,
      isComplete: false,
      possibleComparisons: permutations(
        listSetup[`num_qbs`] + POSITION_OFFSET,
        2
      ),
      positionResults: [],
    },
    RB: {
      playerA: null,
      playerB: null,
      consecutivePicks: 0,
      isComplete: false,
      possibleComparisons: permutations(
        listSetup[`num_rbs`] + POSITION_OFFSET,
        2
      ),
      positionResults: [],
    },
    WR: {
      playerA: null,
      playerB: null,
      consecutivePicks: 0,
      isComplete: false,
      possibleComparisons: permutations(
        listSetup[`num_wrs`] + POSITION_OFFSET,
        2
      ),
      positionResults: [],
    },
    TE: {
      playerA: null,
      playerB: null,
      consecutivePicks: 0,
      isComplete: false,
      possibleComparisons: permutations(
        listSetup[`num_tes`] + POSITION_OFFSET,
        2
      ),
      positionResults: [],
    },
  });
  const [availablePlayers, setAvailablePlayers] = useState({});
  const [modal, setModal] = React.useState(false);

  useEffect(async () => {
    // TODOs:
    // Database:
    // - Position complete flag (to not show two players to compare)
    // Props
    // - isNewList Boolean (to know if we should do things like autorank)
    // - Don't want to hard code first two players at each position

    // Get all players that will be available to the user based on list setup
    const availablePlayersMap = getAvailablePlayerMap(tableData, listSetup);
    setAvailablePlayers(availablePlayersMap);

    // Set position specific default state
    const list = { ...activeList };

    // Set the first two players to be compared at the position (TODO:  if list not complete)
    for (const position in POSITIONS) {
      const positionLimit = listSetup[`num_${position.toLowerCase()}s`];
      const positionResults = await RankingsApi.getListPositionRankingResults(
        listSetup.id,
        position,
        positionLimit
      );
      if (positionResults.length === 0) {
        list[position].playerA =
          allPlayers[POSITIONS[position].redux][
            availablePlayersMap[position][0].id
          ];
        list[position].playerB =
          allPlayers[POSITIONS[position].redux][
            availablePlayersMap[position][1].id
          ];
      } else {
        const initialPlayer = getRandomPlayer(availablePlayersMap, position);
        list[position].playerA =
          allPlayers[POSITIONS[position].redux][initialPlayer.id];
        // initialze variables for next pick
        const positionState = await getPositionState(
          position,
          list[position].playerA,
          availablePlayersMap
        );
        list[position] = positionState;
      }
    }
    // Set the active list with the list state that was just determined
    setActiveList(list);

    // Auto rank players for each position (TODO: If first time list is loading)
    if (listSetup.isNew) {
      await autoRankPlayers(availablePlayersMap);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const autoRankPlayers = async (availablePlayersMap) => {
    for (const position in POSITIONS) {
      const availablePlayers = availablePlayersMap[position];
      for (let i = 0; i < availablePlayers.length; i++) {
        const higherRankedPlayer =
          allPlayers[POSITIONS[position].redux][availablePlayers[i].id];

        // Get any players based who should be autoranked behind this player by defaul based on the threshhold
        for (
          let j = i + AUTO_RANK_THRESHHOLDS[position];
          j < availablePlayers.length;
          j++
        ) {
          const lowerRankedPlayer =
            allPlayers[POSITIONS[position].redux][availablePlayers[j].id];

          //automatically add winning
          await handleChoice(higherRankedPlayer, lowerRankedPlayer, position);
        }
      }
    }
  };

  const handleChoice = async (winningPlayer, losingPlayer, position) => {
    const doesExist = await doesComparisonExist(
      winningPlayer.id,
      losingPlayer.id,
      listSetup.id
    );
    if (doesExist) {
      return;
    }

    // Add comparison to DB
    await RankingsApi.addComparison(
      winningPlayer.id,
      losingPlayer.id,
      listSetup.id,
      user.id,
      winningPlayer.displayName,
      losingPlayer.displayName,
      position
    );

    // Get any players that losingPlayer has a winning comparison against
    const playersLosingPlayerIsBetterThan =
      await RankingsApi.getComparisonsForPlayer(
        losingPlayer.id,
        'winner',
        listSetup.id
      );

    // Get any players that winningPlayer has a losing comparison against
    const playersWinningPlayerIsWorseThan =
      await RankingsApi.getComparisonsForPlayer(
        winningPlayer.id,
        'loser',
        listSetup.id
      );

    /**
     * For any player that losingPlayer is better than,
     * winningPlayer is also better than that player.
     */
    for (let i = 0; i < playersLosingPlayerIsBetterThan.length; i++) {
      const otherPlayer = playersLosingPlayerIsBetterThan[i];
      await handleChoice(
        winningPlayer,
        allPlayers[POSITIONS[position].redux][otherPlayer.loser_id],
        position
      );
    }
    /**
     * For any player that the winningPlayer is NOT better than,
     * the losingPlayer is also NOT better than that player.
     */
    for (let i = 0; i < playersWinningPlayerIsWorseThan.length; i++) {
      const otherPlayer = playersWinningPlayerIsWorseThan[i];
      await handleChoice(
        allPlayers[POSITIONS[position].redux][otherPlayer.winner_id],
        losingPlayer,
        position
      );
    }
  };

  const getPositionState = async (position, initialPlayer, players) => {
    const positionState = { ...activeList[position] };
    let newPlayerA = initialPlayer;
    let newPlayerB = null;

    // Accounts for if the same player has been displayed the max consecutive times in a row
    let consecutivePicks =
      initialPlayer.id === positionState.playerA.id
        ? positionState.consecutivePicks + 1
        : 1;

    // get a new randomPlayer
    const randomPlayer = getRandomPlayer(players, position);

    const comparisonExists = await doesComparisonExist(
      newPlayerA.id,
      randomPlayer.id,
      listSetup.id
    );
    let isComplete = false;
    if (
      !checkIsSamePlayer(newPlayerA, randomPlayer) &&
      !comparisonExists &&
      !(consecutivePicks >= 3)
    ) {
      newPlayerB = randomPlayer;
    } else {
      // No random player was found that hasn't been compared with newPlayerA

      // There are still possible comparisons
      // get another set of players that have not been compared
      const newPlayers = await getTwoPlayersNotCompared(
        positionState.possibleComparisons,
        position,
        players
      );
      if (newPlayers.length === 0) {
        // No more possible comparisons
        console.log('game ended because no two random players found');
        isComplete = true;
      } else {
        newPlayerA = newPlayers[0];
        newPlayerB = newPlayers[1];

        if (consecutivePicks >= 3) {
          // reset Pick
          consecutivePicks = 1;
        }
      }
    }
    const positionLimit = listSetup[`num_${position.toLowerCase()}s`];
    const newResults = await RankingsApi.getListPositionRankingResults(
      listSetup.id,
      position,
      positionLimit
    );
    // Reset game state
    return {
      ...positionState,
      playerA: allPlayers[POSITIONS[position].redux][newPlayerA.id],
      playerB: newPlayerB
        ? allPlayers[POSITIONS[position].redux][newPlayerB.id]
        : null,
      consecutivePicks,
      isComplete,
      isLoading: false,
      positionResults: newResults,
    };
  };

  const advanceNextPick = async (winningPlayer, losingPlayer) => {
    console.log(
      `Winning player: ${winningPlayer.displayName}, Losing player: ${losingPlayer.displayName}`
    );
    setLoading(true);
    await RankingsApi.addPlayersSeen(
      listSetup.id,
      winningPlayer.id,
      losingPlayer.id
    );

    await handleChoice(winningPlayer, losingPlayer, activeTab);

    // initialze variables for next pick
    const positionState = await getPositionState(
      activeTab,
      losingPlayer,
      availablePlayers
    );
    const newActiveList = { ...activeList };
    newActiveList[activeTab] = positionState;
    setActiveList(newActiveList);
    setLoading(false);
  };

  const getTwoPlayersNotCompared = async (
    possibleComparisons,
    position,
    players
  ) => {
    let comparedStop = 0;
    let comparisonFound = false;

    do {
      const randomA = getRandomPlayer(players, position);
      const randomB = getRandomPlayer(players, position);

      const comparisonExists = await doesComparisonExist(
        randomA.id,
        randomB.id,
        listSetup.id
      );
      if (!checkIsSamePlayer(randomA, randomB) && !comparisonExists) {
        comparisonFound = true;
        return [randomA, randomB];
      }

      comparedStop += 1;
    } while (comparedStop < possibleComparisons * 3);
    if (!comparisonFound) {
      return [];
    }
  };

  const checkIsSamePlayer = (player, randomPlayer) => {
    if (player.id === randomPlayer.id) {
      return true;
    }
    return false;
  };

  const getRandomPlayer = (players, position) => {
    const limit = listSetup[`num_${position.toLowerCase()}s`] + POSITION_OFFSET;

    const positionLimit = Math.max(Math.floor(limit), players[position].length);
    const randomPickIndex = Math.floor(
      Math.random() * Math.floor(positionLimit)
    );

    return players[position][randomPickIndex];
  };

  const getTabNavs = () => {
    const tabNavs = [];
    for (const position in POSITIONS) {
      const tabNav = (
        <NavItem key={position}>
          <NavLink
            className={classnames({ active: activeTab === position })}
            onClick={() => {
              toggleTab(position);
            }}
          >
            {position}
          </NavLink>
        </NavItem>
      );

      tabNavs.push(tabNav);
    }
    const cheatSheetNav = (
      <NavItem key='cheat-sheet'>
        <NavLink
          className={classnames({ active: activeTab === 'cheat-sheet' })}
          onClick={() => {
            toggleTab('cheat-sheet');
          }}
        >
          Cheat sheet
        </NavLink>
      </NavItem>
    );
    tabNavs.push(cheatSheetNav);
    return tabNavs;
  };

  const getTabPanes = () => {
    const tabPanes = [];
    for (const position in POSITIONS) {
      const tabPane = (
        <TabPane tabId={position} key={position}>
          <PlayerRankingsTab
            list={listSetup}
            position={position}
            playerA={activeList[position].playerA}
            playerB={activeList[position].playerB}
            advanceNextPick={advanceNextPick}
            positionResults={activeList[position].positionResults}
            isComplete={activeList[position].isComplete}
            setModal={setModal}
            name={listSetup.name}
            position={position}
            loading={loading}
          />
        </TabPane>
      );

      tabPanes.push(tabPane);
    }

    tabPanes.push(
      <CheatSheetTab
        activeList={activeList}
        list={listSetup}
        loading={loading}
      />
    );
    return tabPanes;
  };

  return (
    <div>
      <Nav tabs className='mt-1'>
        {getTabNavs()}
      </Nav>
      <TabContent activeTab={activeTab}>{getTabPanes()}</TabContent>
      <PlayerCompareModal
        modal={modal}
        position={activeTab}
        players={[
          activeList[activeTab]?.playerA,
          activeList[activeTab]?.playerB,
        ]}
        setModal={setModal}
        resetCompare={() => {}}
      />
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

export default connect(mapState, mapDispatch)(PlayerRankingsContainer);
