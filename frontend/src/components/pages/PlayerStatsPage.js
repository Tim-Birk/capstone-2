import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import UserContext from '../../contexts/UserContext';
import ErrorAlert from '../common/ErrorAlert';

import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import Spinner from '../common/Spinner';
import classnames from 'classnames';
import PlayerStatsTable from '../common/PlayerStatsTable';

const PlayerStatsPage = ({ tableData, getAllPlayers }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('QB');
  const [errorMsg, setErrorMsg] = useState(null);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const toggleTab = (tab) => {
    setErrorMsg(null);
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    if (tableData === null) {
      getAllPlayers(setIsLoading);
    } else {
      setIsLoading(false);
    }
  }, [tableData, activeTab, user]);

  if (isLoading) return <Spinner />;

  return (
    <Container className='mt-2'>
      <ErrorAlert
        isHidden={!errorMsg}
        msg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
      <Nav tabs className='mt-1'>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'QB' })}
            onClick={() => {
              toggleTab('QB');
            }}
          >
            QB
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'RB' })}
            onClick={() => {
              toggleTab('RB');
            }}
          >
            RB
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'WR' })}
            onClick={() => {
              toggleTab('WR');
            }}
          >
            WR
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'TE' })}
            onClick={() => {
              toggleTab('TE');
            }}
          >
            TE
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        {activeTab === 'QB' && (
          <TabPane tabId='QB'>
            <PlayerStatsTable position='QB' setErrorMsg={setErrorMsg} />
          </TabPane>
        )}
        {activeTab === 'RB' && (
          <TabPane tabId='RB'>
            <PlayerStatsTable position='RB' setErrorMsg={setErrorMsg} />
          </TabPane>
        )}
        {activeTab === 'WR' && (
          <TabPane tabId='WR'>
            <PlayerStatsTable position='WR' setErrorMsg={setErrorMsg} />
          </TabPane>
        )}
        {activeTab === 'TE' && (
          <TabPane tabId='TE'>
            <PlayerStatsTable position='TE' setErrorMsg={setErrorMsg} />
          </TabPane>
        )}
      </TabContent>
    </Container>
  );
};

const mapDispatch = (dispatch) => ({
  getAllPlayers: dispatch.players.setPlayersAsync,
});

const mapState = (state) => {
  return {
    tableData: state.players.tableData,
  };
};

export default connect(mapState, mapDispatch)(PlayerStatsPage);
