import axios from 'axios';
import { createComparison, BASE_URL } from '../helpers';

class RankingsApi {
  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {};
    const params = method === 'get' ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Add a new list. */

  static async addList(list) {
    console.log(list);
    let res = await this.request('lists', list, 'post');
    return res.rankingsList;
  }

  /** Update an existing list. */

  static async updateList(listid, list) {
    let res = await this.request(`lists/${listid}`, list, 'patch');
    return res.rankingsList;
  }

  /** Delete an existing list. */

  static async deleteList(listid, list) {
    let res = await this.request(`lists/${listid}`, list, 'delete');
    return res;
  }

  /** Get list details. */

  static async getList(listid) {
    let res = await this.request(`lists/${listid}`);
    return res.rankingsList;
  }

  /** Get all lists for a user. */

  static async getLists(userid) {
    let res = await this.request(`lists/user/${userid}`);
    return res.rankingsLists;
  }

  /** Add a new comparison. */

  static async addComparison(
    winner_id,
    loser_id,
    list_id,
    user_id,
    winner_name = null,
    loser_name = null,
    position
  ) {
    // Create a “winning comparison object”, comparisonX, where the winningPlayer also ‘beats’ playerX
    const comparison = createComparison(
      winner_id,
      loser_id,
      list_id,
      user_id,
      winner_name,
      loser_name,
      position
    );
    let res = await this.request('comparisons', comparison, 'post');
    return res.rankingComparison;
  }

  /** Update an existing comparison. */

  static async updateComparison(comparisonid, comparison) {
    let res = await this.request(
      `comparisons/${comparisonid}`,
      comparison,
      'patch'
    );
    return res.rankingComparison;
  }

  /** Delete an existing comparison. */

  static async deleteComparison(comparisonid, comparison) {
    let res = await this.request(
      `comparison/${comparisonid}`,
      comparison,
      'delete'
    );
    return res;
  }

  /** Get comparison details. */

  static async getComparison(comparisonid) {
    let res = await this.request(`comparisons/${comparisonid}`);
    return res.rankingComparison;
  }

  /** Get all comparisons for a list. */

  static async getComparisonsByList(listid) {
    let res = await this.request(`comparisons/list/${listid}`);
    return res.rankingComparisons;
  }

  /** Get all comparisons for a list by position. */

  static async getComparisonsByList(listid, position) {
    let res = await this.request(`comparisons/list/${listid}/${position}`);
    return res.rankingComparisons;
  }

  /** Get all ranking results for a list by position. */

  static async getListPositionRankingResults(listid, position, positionLimit) {
    let res = await this.request(
      `comparisons/results/list/${listid}/${position}?limit=${positionLimit}`
    );
    return res.rankingComparisons;
  }

  /** Get all comparisons for a player_id, type ('winner'/'loser') and list_id. */

  static async getComparisonsForPlayer(player_id, type, listid) {
    let res = await this.request(
      `comparisons/list/${listid}?${type}_id=${player_id}`
    );
    return res.rankingComparisons;
  }

  /** Get comparison by comparisonKey. */

  static async getComparisonsByComparisonKey(comparisonKey) {
    let res = await this.request(`comparisons/${comparisonKey}`);
    return res.rankingComparison;
  }

  /** Add players seen by the user in a comparison for displaying rankings to the user
   * (We don't want to show them a ranked player they have not yet seen). */

  static async addPlayersSeen(list_id, winnerid, loserid) {
    let res = await this.request(
      `comparisons/list/${list_id}/seen?winnerid=${winnerid}&loserid=${loserid}`,
      {},
      'post'
    );
    return res;
  }

  /** ************Player rankings lists****************** */

  /** Add a new player lists. */

  static async addPlayersList(list, list_id, user_id, positionDelete = false) {
    let res = await this.request(
      'playerlists',
      { list, list_id, user_id, positionDelete },
      'post'
    );
    return res.rankingPlayersList;
  }

  /** Delete an existing position for a list. */

  static async deletePlayerRankingsListPosition(list_id, position) {
    let res = await this.request(
      `playerlists/${list_id}/${position}`,
      {},
      'delete'
    );
    return res;
  }

  /** Get rankings player list by list id. */

  static async getPlayersListByListId(list_id) {
    let res = await this.request(`playerlists/list/${list_id}`);
    return res.rankingPlayersList;
  }
}

export default RankingsApi;
