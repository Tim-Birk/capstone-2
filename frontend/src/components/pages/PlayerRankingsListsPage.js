import { useState, useContext, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import UserContext from '../../contexts/UserContext';
import ErrorAlert from '../common/ErrorAlert';
import PlayerRankingsModal from '../common/PlayerRankingsModal';
import PlayerRankingsContainer from '../common/PlayerRankingsContainer2';
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

const PlayerRankingsListsPage = ({ rankingsLists, getUserRankingsLists }) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [activeListSetup, setActiveListSetup] = useState(null);
  const [activeTab, setActiveTab] = useState('QB');
  const [errorMsg, setErrorMsg] = useState(null);
  const { list_id } = useParams();
  const history = useHistory();

  useEffect(async () => {
    if (!user) {
      history.push('/login');
    }

    if (user && (!rankingsLists || rankingsLists.length === 0)) {
      getUserRankingsLists({ setIsLoading, userId: user.id });
    } else {
      if (user && list_id && rankingsLists) {
        const userList = rankingsLists.filter((list) => list.id === list_id);
        if (userList.length > 0) {
          setActiveListSetup(userList[0]);
        }
      }
      setIsLoading(false);
    }
  }, [rankingsLists, activeTab, user]);

  // const handleGetList = async (e) => {
  //   const listId = e.target.getAttribute('data-id');
  //   const list = await RankingsApi.getList(listId);
  //   setActiveListSetup(list);
  // };

  const handleDeleteList = async (e) => {
    const listId = closest(e.target, 'button')?.getAttribute('data-id');
    if (!listId) {
      return;
    }
    await RankingsApi.deleteList(listId);
    getUserRankingsLists({ setIsLoading, userId: user.id });
  };

  if (isLoading) return <Spinner />;

  return (
    <Container className='mt-2'>
      <ErrorAlert
        isHidden={!errorMsg}
        msg={errorMsg}
        setErrorMsg={setErrorMsg}
      />

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
                  <Link to={`/my-rankings/${list.id}`}>{list.name}</Link>
                  {'            '}
                  <i>{Moment(list.created_at).format('MM-DD-YYYY')}</i>
                  <IconButton
                    aria-label='delete'
                    className='mb-1'
                    onClick={handleDeleteList}
                    data-id={list.id}
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              );
            })}
        </ul>
      </>
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

export default connect(mapState, mapDispatch)(PlayerRankingsListsPage);
