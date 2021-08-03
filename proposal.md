# Fantasy Football Draft Assistant

## Overview:
The goal of this app is to provide fantasy football enthusiasts a centralized application to do their draft preparation and reseach.  Users can view historical player data and analytics as well as generate their own personalized rankings cheat sheet to bring to their draft!

The user demographic will include:
 - all levels of skill at fantasy football
 - a wide range of ages
 - located all over the world
 - both technical and non-technical backgrounds

## Data Sources:
The main source of the data will be provided by the [Sportsradar](https://developer.sportradar.com/docs/read/Home).  This API provides the actual historical stat data for each player by season.  It will serve as the foundation of the data visualaztions and comparison tools that the site offers.  

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
 

## Beyond CRUD:


