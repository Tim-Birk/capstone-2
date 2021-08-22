/** Routes for players. */
const axios = require('axios');
const cheerio = require('cheerio');

var sdv = require('sportsdataverse');

const express = require('express');
const router = express.Router();

const FANTASY_POSITIONS = new Set([
  'Quarterback',
  'Wide Receiver',
  'Running Back',
  'Tight End',
]);

/**
 * Gets top 200 list of players from cbs expert using a web scraper
 * this list is used to limit the overall dataset returned to the client and has the
 * top 200 relevant fantasy players which is more than enough for our purposes
 * @returns {slug: {rank, name, position, slug}, ...}
 * Note: we use slug as the key because it is the most reliable value to map to the sportsdataverse api
 */
const getTop200List = async () => {
  return axios(
    'https://www.cbssports.com/fantasy/football/rankings/standard/top200/'
  )
    .then((response) => {
      const top200List = {};
      const html = response.data;
      const $ = cheerio.load(html);

      const statsTable = $(
        'div.rankings-table.multi-authors > div:nth-child(1) > div.player-wrapper > div.player-row'
      );
      statsTable.each(function () {
        const rank = $(this).find('.rank').text();
        const name = $(this).find('.player-name').text();
        const position = $(this).find('.team.position').text().trim();
        const slug = $(this)
          .find('a')
          .attr('href')
          .replace('/fantasy/football/players/', '')
          .split('/')[1]
          .toUpperCase();

        top200List[slug] = {
          rank,
          name,
          position,
          slug,
        };
      });
      return top200List;
    })
    .catch(console.error);
};

/**
 * GET - /players
 * Gets list of fantasy relevant players with career stats info
 * @returns
 *   {
 *     quarterbacks: {playerKey: {playerProfileInfo..., playerStatInfo...},
 *     runningbacks: {playerKey: {playerProfileInfo..., playerStatInfo...},
 *     wideReceivers: {playerKey: {playerProfileInfo..., playerStatInfo...},
 *     tightEnds: {playerKey: {playerProfileInfo..., playerStatInfo...},
 *   }
 */
router.get('/', async function (req, res, next) {
  try {
    const top200List = await getTop200List();

    // There is no endpoint to get a full player list from sportsdataverse api so we need to first
    // get the the full team list
    const response = await sdv.nfl.getTeamList();
    const teamList = response.sports[0].leagues[0].teams;

    let quarterbacks = {};
    let runningBacks = {};
    let wideReceivers = {};
    let tightEnds = {};

    for (let i = 0; i < teamList.length; i++) {
      const { team } = teamList[i];
      // Get team info to add to each player
      const { name, displayName: teamDisplayName, abbreviation } = team;
      // Get full player list for each team from sportsdataverse api
      const respRoster = await sdv.nfl.getTeamPlayers(team.id);

      const { athletes } = respRoster.team;

      for (let j = 0; j < athletes.length; j++) {
        let athlete = athletes[j];
        const position = athlete.position.name;
        const playerSlug = `${athlete.firstName.toUpperCase()}-${athlete.lastName.toUpperCase()}`;
        // Determine if this is a relevant fantasy player
        if (
          athlete.active &&
          FANTASY_POSITIONS.has(position) &&
          top200List[playerSlug]
        ) {
          // Relevant player so get profile info
          const {
            id,
            firstName,
            lastName,
            fullName,
            displayName,
            shortName,
            weight,
            displayWeight,
            height,
            displayHeight,
            age,
            dateOfBirth,
            debutYear,
            birthPlace,
            college,
            slug,
            headshot,
            jersey,
            injuries,
            teams,
            experience,
            active,
            draft,
          } = athlete;
          const playerKey = fullName + '__' + jersey;
          const currentTeam = { name, teamDisplayName, abbreviation };

          let player = {
            id,
            firstName,
            lastName,
            fullName,
            displayName,
            shortName,
            weight,
            displayWeight,
            height,
            displayHeight,
            age,
            dateOfBirth,
            debutYear,
            birthPlace,
            college,
            slug,
            headshot,
            jersey,
            position,
            injuries,
            teams,
            experience,
            active,
            draft,
            overallRanking: Number(top200List[playerSlug].rank),
            currentTeam,
            statCategories: [],
          };

          // Get player stats detail
          // note: not all players will have stats (e.g. rookies, season-long injuries, etc.)
          let respStats = null;
          // don't waste a request if a rookie
          if (experience.years > 0) {
            const playerStatsUrl = `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/stats?region=us&lang=en&contentorigin=espn`;
            try {
              respStats = await axios.get(playerStatsUrl);

              player.statCategories = respStats.data.categories
                ? respStats.data.categories
                : [];
            } catch {
              console.log(`No stats available for ${displayName}`);
            }
          }

          switch (position) {
            case 'Quarterback':
              quarterbacks[playerKey] = player;
              break;
            case 'Wide Receiver':
              wideReceivers[playerKey] = player;
              break;
            case 'Running Back':
              runningBacks[playerKey] = player;
              break;
            case 'Tight End':
              tightEnds[playerKey] = player;
              break;
          }
        }
      }
    }

    return res.json({
      quarterbacks,
      runningBacks,
      wideReceivers,
      tightEnds,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
