const COMPARISON_KEY_SEPARATOR = '~';
const LIST_ID = 1234;
const fullComparisonMap = {};

/**
 * ComparisonObject:
 * position: [
 *  {
 *      listId: id,
 *      userId: id,
 *      winningPlayerId: id,
 *      losingPlayerId id
 *   (serialized only)
 *      winningPlayer: {id, name, team, ...},
 *      losingPlayer:  {id, name, team, ...}
 *  }, ...]
 *
 * ComparisonMap:
 *  comparisonKey = `${winningPlayer.id}~${losingPlayer.id}`
 *
 *  {
 *     comparisonKey: {ComparisonObject},
 *     comparisonKey: {ComparisonObject},
 *     comparisonKey: {ComparisonObject},
 *     ...
 *  }
 *
 */

/**
 * For any player that losingPlayer is better than,
 * winningPlayer is also better than that player.
 */
const handleLosingPlayersBetterThan = (winningPlayer, losingPlayer) => {
  // Get any players that losingPlayer has a winning comparison against
  const playersLosingPlayerIsBetterThan = [];
  //
  // (Base case:  losingPlayer has no winning comparisons)
  if (playersLosingPlayerIsBetterThan.length === 0) {
    return;
  }
  //  Otherwise for each player (playerX) found:
  playersLosingPlayerIsBetterThan.forEach((playerX) => {
    // Create a “winning comparison object”, comparisonX, where the winningPlayer also ‘beats’ playerX
    //
    // Determine if comparisonX already exists in fullComparisonMap
    //    If comparisonX already exists:
    //        skip this comparison and go to the next
    //    If comparisonX does not exist, add this comparison to the fullComparisonMap (and/or the list to add to db?):
    //        Look for any other player (playerY) who playerX has a losing comparison against:
    //           for each one found… rercurse…
    //             handleLosingPlayersBetterThan(playerX, playerY)
  });
};

/**
 * For any player that the winningPlayer is NOT better than,
 * the losingPlayer is also NOT better than that player.
 */
const handleWinningPlayersWorseThan = (winningPlayer, losingPlayer) => {
  // Get any players that winningPlayer has a losing comparison against
  const playersWinningPlayerIsWorseThan = [];
  //
  // (Base case:  winningPlayer has no losing comparisons)
  if (playersWinningPlayerIsWorseThan.length === 0) {
    return;
  }
  //  Otherwise for each player (playerX) found:
  playersWinningPlayerIsWorseThan.forEach((playerX) => {
    // Create a losing comparison object”, comparisonX, where losingPlayer is also ‘beaten by’ this player
    //
    // Determine if comparisonX already exists in fullComparisonMap
    //    If comparisonX already exists:
    //        skip this comparison and go to the next
    //    If comparisonX does not exist, add this comparison to the fullComparisonMap (and/or the list to add to db?):
    //        Look for any other player who this player has a losing comparison against:
    //            for each one found… rercurse…
    //                playersWinningPlayerIsWorseThan(playerY, playerX)
  });
};

const doesComparisonExist = (id1, id2) => {
  const key1 = `${id1}${COMPARISON_KEY_SEPARATOR}${id2}`;
  const key2 = `${id2}${COMPARISON_KEY_SEPARATOR}${id1}`;
  return fullComparisonMap[key1] || fullComparisonMap[key2];
};

export {
  handleLosingPlayersBetterThan,
  handleWinningPlayersWorseThan,
  doesComparisonExist,
};
