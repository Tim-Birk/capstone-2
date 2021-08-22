import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Container, Nav, NavItem, NavLink } from 'reactstrap';
import MaterialTable from 'material-table';
import PlayersApi from '../../api/PlayersApi';
import Spinner from '../common/Spinner';
import classnames from 'classnames';
import { getTableColumns, getTableData } from '../../helpers';

const PlayerStatsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playerList, setPlayerList] = useLocalStorage('playerList');
  const [players, setPlayers] = useState();
  const [activeTab, setActiveTab] = useState('QB');
  const [tablePlayers, setTablePlayers] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  async function getPlayers() {
    setTableColumns(getTableColumns(activeTab));
    if (user) {
      if (!playerList) {
        let allPlayers = await PlayersApi.getPlayers();
        setPlayerList(JSON.stringify(allPlayers));
        setPlayers(allPlayers);
        setTablePlayers(getTableData(allPlayers, activeTab));
      } else {
        const allPlayers = JSON.parse(playerList);
        setPlayers(allPlayers);
        setTablePlayers(getTableData(allPlayers, activeTab));
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    // Load companies from database and set global state for each array
    getPlayers();
  }, [user, history, activeTab]);

  if (isLoading) return <Spinner />;

  return (
    <Container className='mt-1'>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'QB' })}
            onClick={() => {
              toggle('QB');
            }}
          >
            QB
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'RB' })}
            onClick={() => {
              toggle('RB');
            }}
          >
            RB
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'WR' })}
            onClick={() => {
              toggle('WR');
            }}
          >
            WR
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'TE' })}
            onClick={() => {
              toggle('TE');
            }}
          >
            TE
          </NavLink>
        </NavItem>
      </Nav>
      <MaterialTable
        columns={tableColumns}
        data={tablePlayers}
        title={`${activeTab}s`}
        options={{
          pageSize: 10,
        }}
      />
    </Container>
  );
};

export default PlayerStatsPage;
