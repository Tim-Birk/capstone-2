import { useState, useContext, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import UserContext from '../../contexts/UserContext';
import ErrorAlert from '../common/ErrorAlert';
import PlayerRankingsModal from '../common/PlayerRankingsModal';
import PlayerRankingsContainer from '../common/PlayerRankingsContainer2';
import ProgressBar from '../common/ProgressBar';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import Moment from 'moment';
import _ from 'lodash';
import { closest } from '../../helpers';

import {
  Button,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import Spinner from '../common/Spinner';
import classnames from 'classnames';
import RankingsApi from '../../api/RankingsApi';

const PlayerRankingsPage = ({ rankingsLists, getUserRankingsLists }) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [activeListSetup, setActiveListSetup] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { list_id } = useParams();
  // const history = useHistory();

  useEffect(async () => {
    if (!user) {
      // history.push('/login');
    }

    if (user && (!rankingsLists || rankingsLists.length === 0)) {
      getUserRankingsLists({ setIsLoading, userId: user.id });
    } else {
      setIsLoading(false);
    }

    if (user && list_id && rankingsLists) {
      const userList = rankingsLists.filter((list) => list.id === list_id);
      if (userList.length > 0) {
        setActiveListSetup(userList[0]);
      }
    }
  }, [rankingsLists, user]);

  if (isLoading) {
    return (
      <div className='mt-5'>
        <ProgressBar message='Loading rankings list...' />
      </div>
    );
  }

  return (
    <Container className='mt-2'>
      <ErrorAlert
        isHidden={!errorMsg}
        msg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
      {activeListSetup ? (
        <PlayerRankingsContainer listSetup={activeListSetup} user={user} />
      ) : null}
    </Container>
  );
};

const mapDispatch = (dispatch) => {
  return {
    getUserRankingsLists: dispatch.players.setRankingsListsAsync,
  };
};

const mapState = (state) => {
  return {
    rankingsLists: state.players.rankingsLists,
  };
};

export default connect(mapState, mapDispatch)(PlayerRankingsPage);
