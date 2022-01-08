## Fantasy Football Assistant

[View Application](https://fantasy-football-assistant.surge.sh/)

Generate your own rankings cheat sheet based on player versus player comparisons. Analyze and compare players based on historical data and current trends.

## Login and create a new rankings list

1. Sign up for an account:

![Sign up](/screenshots/signup.PNG)

2. Navigate to the 'My Rankings' page and clicke 'New':

![My Rankings](/screenshots/myrankings.PNG)

3. Set up a new rankings list:

![Set up new list](/screenshots/setupnewlist.PNG)

4. For each position, make your picks until the rankings are complete for that position:

![Make picks](/screenshots/makepicks.PNG)

5. Will making picks, you can click 'Compare players' to help you decide based on historical data between the two players:

![Compare players](/screenshots/compareplayers.PNG)

6. Making picks will start to build out your 'Cheat sheet' which is your personalized rankings which you can bring to your draft!

![Cheat sheet](/screenshots/cheatsheet.PNG)

7. Print friendly cheat sheet:

![Print cheat sheet](/screenshots/cheatprint.PNG)

## Rankings Algorithm

In order to prevent the user from having to make every single player comparison manually, there is a recursive algorithm that minimizes the number of choices that need to be made by using implied comparisons. More information on how that algorithm works can be found [here](https://docs.google.com/presentation/d/1y3bGtFFVYjsNVEyokFUPeJaxHPs3nknTxUhKI3VdDyY/edit?usp=sharing).

## Run Locally

Make sure [PostgreSQL](https://www.postgresql.org/) is installed. Then run the following commads in a git bash terminal:

1. Clone repository:

```
$ git clone https://github.com/Tim-Birk/capstone-2.git
```

2. Navigate into backend directory:

```
$ cd capstone-2/backend/
```

3. Install backend packages:

```
$ npm install
```

4. Start server:

```
$ node server.js
```

5. Open a new terminal and open up the postrgesql shell:

```
$ psql
```

6. Create a new database:

```
postgres=# CREATE DATABASE fantasy_assistant;
```

7. Open a new terminal and navigate to frontend directory:

```
$ cd capstone-2/frontend/
```

8. Install frontend packages:

```
$ npm install
```

9. Start app

```
$ npm start
```

10. Sign up and create a user to view hidden tabs.

## Technology Stack

- Backend: NodeJs, Express, PostgreSQL
- Frontend: React, HTML, CSS, Reactstrap (Bootstrap), MaterialUI
