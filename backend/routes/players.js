/** Routes for players. */

var sdv = require('sportsdataverse');

const express = require('express');
const router = express.Router();

const FANTASY_POSITIONS = new Set([
  'Quarterback',
  'Wide Receiver',
  'Running Back',
  'Tight End',
]);

router.get('/', async function (req, res, next) {
  try {
    const response = await sdv.nfl.getTeamList();
    const teamList = response.sports[0].leagues[0].teams;

    const teamMap = {};
    let quarterbacks = {};
    let runningBacks = {};
    let wideReceivers = {};
    let tightEnds = {};

    for (let i = 0; i < teamList.length; i++) {
      const { team } = teamList[i];
      const { name, displayName: teamDisplayName, abbreviation } = team;
      const respRoster = await sdv.nfl.getTeamPlayers(team.id);
      const { athletes } = respRoster.team;

      for (let j = 0; j < athletes.length; j++) {
        let athlete = athletes[j];
        const position = athlete.position.name;
        if (athlete.active && FANTASY_POSITIONS.has(position)) {
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

          const player = {
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
            currentTeam,
          };

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
      teamMap[team.id] = { team: respRoster.team };
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
