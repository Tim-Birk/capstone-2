import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import UserContext from '../../contexts/UserContext';
import ErrorAlert from '../common/ErrorAlert';
import PlayerRankingsModal from '../common/PlayerRankingsModal';
import PlayerRankingsContainer from '../common/PlayerRankingsContainer2';
import Moment from 'moment';
import _ from 'lodash';

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
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [activeListSetup, setActiveListSetup] = useState(null);
  const [activeTab, setActiveTab] = useState('QB');
  const [errorMsg, setErrorMsg] = useState(null);
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    if (user && (!rankingsLists || rankingsLists.length === 0)) {
      getUserRankingsLists({ setIsLoading, userId: user.id });
    } else {
      setIsLoading(false);
    }
  }, [rankingsLists, activeTab, user]);

  const handleGetList = async (e) => {
    const listId = e.target.getAttribute('data-id');
    const list = await RankingsApi.getList(listId);
    setActiveListSetup(list);
  };

  if (isLoading) return <Spinner />;

  return (
    <Container className='mt-2'>
      <ErrorAlert
        isHidden={!errorMsg}
        msg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
      {activeListSetup ? (
        <PlayerRankingsContainer listSetup={activeListSetup} user={user} />
      ) : (
        <>
          <Button
            color='primary'
            onClick={() => {
              setModal(true);
            }}
          >
            New list
          </Button>
          <h3 className='mt-3'>My rankings lists:</h3>
          <ul>
            {rankingsLists &&
              rankingsLists.map((list) => {
                return (
                  <li key={list.id}>
                    <a href='#' data-id={list.id} onClick={handleGetList}>
                      {list.name}
                    </a>
                    {'            '}
                    <i>{Moment(list.created_at).format('MM-DD-YYYY')}</i>
                  </li>
                );
              })}
          </ul>
        </>
      )}

      <PlayerRankingsModal
        user={user}
        modal={modal}
        setModal={setModal}
        setActiveListSetup={setActiveListSetup}
      />
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
