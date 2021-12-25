# Fantasy Football Draft Assistant

## Overview:

The goal of this app is to provide fantasy football enthusiasts a centralized application to do their draft preparation and reseach. Users can view historical player data and analytics as well as generate their own personalized rankings cheat sheet to bring to their draft!

The user demographic will include:

- all levels of skill at fantasy football
- a wide range of ages
- located all over the world
- both technical and non-technical backgrounds

## Data Sources:

The main source of the data will be provided by the [Sportsradar](https://developer.sportradar.com/docs/read/Home). This API provides the actual historical stat data for each player by season. It will serve as the foundation of the data visualaztions and comparison tools that the site offers.

## Database Schema:

## Potential API Issues:

- Sportradar does not have player images available so I need another source to map images to this api data.

## Sensitive Information:

- Encrypted passwords will be stored for the user model.
- At a minimum, an email address needs to be provided to identify a single user.
- A single user's cheat sheets should be shareable, but not public to anyone (e.g. I don't want my league-mates seeing how I have players ranked prior to the draft)

## Functionality:

- Users will have their own profile set up that includes basic information that they can edit.
- Search for player by name or team to view historical data and visualazations displaying trends for various stat categories relevant to their position.
- Create a personal rankings cheat sheet for every league.
  - Comparison tools available when deciding how to rank players

## User Flow:

I. Landing page

- Link to register/login
- Some high-level overview of the site & features

II. Player stats tab

- Sportsradar provides historical stats for every season of every player's career
- Two ways to browse players:
  1. Type their name into a search bar
  2. Browse over team rosters and drill into player
- Whichever method to navigate to a player, there will need to be some type of "player detail component"
  - This component can has 3 main functions:
    1. Give the user the ability to view key stats relevant to the player's position for any season of their career
       - this would be a good place to use some type of color coding for certain good/bad threshholds for each category
    2. Use charts/visualaztions to show trends over time for certain categories
    3. Give the user away to compare another player to the current player being viewed (outside of the rankings assistant)
       - the "compare players interface" will be its own component that can probably be reused in the rankings assistant tab
       - this component will do side by side comparisons of the key stat categories and will also use charts and visualations to compare trends
       - this would be a good place to use the scatter plot to show some good visual comparisons

III. My rankings tab

- The object of the my rankings tab is for the user to create a ranked list (aka cheat sheet) of players by each position

  - a user can have multiple lists created for their account
  - for each list, the user ranks out a specified number of players for each position (e.g. Top 20 QBs, 30 RBs, 50 Wrs, 15 TEs)
  - positional rankings are made by the application displaying two players to the user for that position and the user making a selection of one over the other
    - when the two players are displayed, the user will have comparison tools at their disposal such as viewing key positional stats for last season and other visualations to compare how both players are trending in certain stat categories with historical data
    - this would be a good place to re-use the "compare players interface" in the Players stats tab above
    - a big benefit here is that the algorithm will not make the user have to manually compare every possible 2-player comparison that exists-- it will make implied choices based on already existing comparisons that have been made
      - e.g. If you pick Player A over Player B...
        - the players currently ranked ahead of Player A are also ranked over Player B
        - the players currently ranked behind Player B are also ranked behind Player A

- On this tab, the user can browse and re-open previous lists they've created as well as create a new list

- Flow for creating a new list:

  1. Click "New Cheat Sheet" button
  2. The user will provide a name for this particular set of rankings (e.g. Long Island League, College Friends League, etc.)
  3. This will open a component that has tabs for each position (QB, RB, WR, TE)
     - each position tab will have their own "Settings" that can be configured
       - currently these settings only has the number of players to rank out for each position
       - if the above setting is changed at any time, the positional list needs to be cleared out and reset
       - can add to these settings as needed
  4. To start, each position will display the top two players (based on a default underlying set of rankings for that position)
     - As the user makes selections, the algorithm will take into account the user's choices and also make implied comparisons based on the data it already has
     - Each player object has a bucket of players ranked behind them and a bucket of players ranked ahead of them
     - It is crucial that the user finishes making all of the necessary manual comaparisons to "complete" the rankings for that position
     - The user is finished ranking out a position when every combination of player comparison has been made either explicitly or implied by the algorithm
     - Essentially a player's final ranking is the player.playersBehind.count + 1
  5. Once the user ranks out each position, their cheat sheet will be ready for export/print.
     - Options:
       - Print
       - Copy to clipboard
       - Shareable link
       - Email?
       - Excel?

- Question of whether to support the user having an unfinished list that they can leave halfway through and come back to

- Another cool reach goal would be to have some tool to compare lists somehow against each other
