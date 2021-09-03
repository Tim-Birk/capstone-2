import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import LoginForm from './components/user/LoginForm';
import Profile from './components/user/Profile';
import SignupForm from './components/user/SignupForm';
import Spinner from './components/common/Spinner';
import NavBar from './components/common/NavBar';
import PlayerStatsPage from './components/pages/PlayerStatsPage';
import PlayersApi from './api/PlayersApi';
import UsersApi from './api/UsersApi';
import UserContext from './contexts/UserContext';
import PlayersContext from './contexts/PlayersContext';
import jwt from 'jsonwebtoken';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerDetailPage from './components/pages/PlayerDetailPage';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [playerList, setPlayerList] = useLocalStorage('playerList');
  const [playerMap, setPlayerMap] = useState(null);
  const [token, setToken] = useLocalStorage('tokenKey');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    /* If the value of token changes the refresh all of the user info stored
    /* in localstorage and on the UserContext */
    async function getUser() {
      if (token) {
        try {
          // Make token value accessible in the api component
          UsersApi.token = token;
          // Get username from from jwt
          let { username } = jwt.decode(token);
          // Find current user based on user name return from jwt
          let currentUser = await UsersApi.getUser(username);
          // Set user in app state
          setUser(currentUser);
        } catch (err) {
          console.error(err.message);
          setUser(null);
        }
      } else {
        // No token so explicitly set user to null here
        setUser(null);
      }
      await getPlayerMap();
      setIsLoading(false);
    }

    async function getPlayerMap() {
      if (token) {
        try {
          if (!playerList) {
            let allPlayers = await PlayersApi.getPlayers();
            setPlayerList(JSON.stringify(allPlayers));
            setPlayerMap(allPlayers);
          } else {
            const allPlayers = JSON.parse(playerList);

            setPlayerMap(allPlayers);
          }
        } catch (err) {
          console.error(err.message);
          setPlayerMap(null);
        }
      } else {
        // No token so explicitly set playerMap to null here
        setPlayerMap(null);
      }
    }
    setIsLoading(true);
    getUser();
  }, [token, playerList, setPlayerList]);

  const addUser = async (newUser) => {
    try {
      // Add user via api and get token that is returned from POST request
      const userToken = await UsersApi.addUser(newUser);
      // Set token to trigger useEffect
      setToken(userToken);
      //clear previous errors
      setErrorMessage(null);
    } catch (e) {
      setToken(null);
      setErrorMessage({ type: 'signup', message: e });
      console.log('Add user error:', e);
    }
  };

  const updateUser = async (existingUser) => {
    try {
      // Rerun login user to make sure they provided correct password before updating profile
      const loginSuccess = await loginUser({
        username: user.username,
        password: existingUser.password,
      });
      if (!loginSuccess) {
        return;
      }
      // Update user via api and get new updated object that is returned from PATCH request
      const updatedUser = await UsersApi.updateUser(
        user.username,
        existingUser
      );
      // Set updated user
      setUser(updatedUser);
      // clear previous errors
      setErrorMessage(null);
      // return true for successful update
      return true;
    } catch (e) {
      // setToken(null);
      setErrorMessage({ type: 'update', message: e });
      console.log('Update user error:', e);
      // return true for unsuccessful update
      return false;
    }
  };

  const loginUser = async (userToLogin) => {
    try {
      // Login user via api and get token that is returned from POST request
      const userToken = await UsersApi.loginUser(userToLogin);
      // Set token to trigger useEffect
      setToken(userToken);
      //clear previous errors
      setErrorMessage(null);
      // return true for successful login
      return true;
    } catch (e) {
      setToken(null);
      setErrorMessage({ type: 'login', message: e });
      console.log('Login user error:', e);
      // return true for unsuccessful login
      return false;
    }
  };

  const logout = () => {
    try {
      setToken(null);
    } catch (e) {
      setToken(null);
      console.log('Logout user error:', e);
    }
  };

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <NavBar logout={logout} />
        {isLoading ? (
          <Spinner />
        ) : (
          <main>
            <Container>
              <Switch>
                <Route exact path='/'>
                  <h1>Home Page!!!</h1>
                </Route>
                <Route exact path='/login-sucess'>
                  <h1>Login Success!!!</h1>
                </Route>
                <Route exact path='/profile'>
                  <Profile updateUser={updateUser} error={errorMessage} />
                </Route>
                <Route path='/login'>
                  <LoginForm loginUser={loginUser} error={errorMessage} />
                </Route>
                <Route path='/signup'>
                  <SignupForm addUser={addUser} error={errorMessage} />
                </Route>
                <PlayersContext.Provider value={{ playerMap }}>
                  <Route exact path='/player-stats'>
                    <PlayerStatsPage />
                  </Route>
                  <Route path='/players/:position/:id'>
                    <PlayerDetailPage />
                  </Route>
                  <Route exact path='/my-rankings'>
                    <h1>My rankings</h1>
                  </Route>
                </PlayersContext.Provider>
                <Route>
                  <div>Not Found Component</div>
                </Route>
              </Switch>
            </Container>
          </main>
        )}
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
