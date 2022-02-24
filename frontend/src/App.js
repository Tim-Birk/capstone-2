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
import UsersApi from './api/UsersApi';
import UserContext from './contexts/UserContext';
import jwt from 'jsonwebtoken';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerDetailPage from './components/pages/PlayerDetailPage';
import { connect } from 'react-redux';
import './App.css';
import PlayerRankingsPage from './components/pages/PlayerRankingsPage';
import PlayerRankingsListsPage from './components/pages/PlayerRankingsListsPage';

function App({ getRankingsLists, setInitialState, getAllPlayers }) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
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

      setIsLoading(false);
    }

    setIsLoading(true);
    getUser();
  }, [token]);

  const addUser = async (newUser) => {
    try {
      // Add user via api and get token that is returned from POST request
      const userToken = await UsersApi.addUser(newUser);
      // Set token to trigger useEffect
      setToken(userToken);
      //clear previous errors
      setErrorMessage(null);

      getAllPlayers(setIsLoading);
    } catch (e) {
      setToken(null);
      const msg = e[0]?.includes('email')
        ? 'This email already exists in the database.'
        : e;
      setErrorMessage({ type: 'signup', message: msg });
      console.log('Add user error:', msg);
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

      getAllPlayers(setIsLoading);
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
      getRankingsLists({ setIsLoading, userId: 0 });
      setInitialState();
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
                  <h1 className='mt-5 text-center'>
                    Fantasy Football Assistant
                  </h1>
                  <p className='mt-3 text-center'>
                    Analyze and compare players based on historical data and
                    current trends. Create your own rankings cheat sheet for any
                    fantasy football league.
                  </p>
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
                <Route exact path='/player-stats'>
                  <PlayerStatsPage />
                </Route>
                <Route path='/players/:position/:id'>
                  <PlayerDetailPage />
                </Route>
                <Route exact path='/my-rankings'>
                  <PlayerRankingsListsPage />
                </Route>
                <Route path='/my-rankings/:list_id'>
                  <PlayerRankingsPage />
                </Route>
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
const mapState = (state) => {
  return {
    rankingsLists: state.players.rankingsLists,
  };
};
const mapDispatch = (dispatch) => ({
  getRankingsLists: dispatch.players.setRankingsListsAsync,
  setInitialState: dispatch.players.setInitialState,
  getAllPlayers: dispatch.players.setPlayersAsync,
});

export default connect(mapState, mapDispatch)(App);
