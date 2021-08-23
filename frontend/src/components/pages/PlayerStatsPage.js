import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PlayersContext from '../../contexts/PlayersContext';
import UserContext from '../../contexts/UserContext';
import { Container, Nav, NavItem, NavLink } from 'reactstrap';
import MaterialTable from 'material-table';
import Spinner from '../common/Spinner';
import classnames from 'classnames';
import { getTableColumns, getTableData, POSITIONS } from '../../helpers';

const PlayerStatsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('QB');
  const [tablePlayers, setTablePlayers] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const { user } = useContext(UserContext);
  const { playerMap } = useContext(PlayersContext);
  const history = useHistory();

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  async function getPlayers() {
    setTableColumns(getTableColumns(activeTab));
    setTablePlayers(getTableData(playerMap, activeTab));

    setIsLoading(false);
  }

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    getPlayers();
  }, [activeTab]);

  if (isLoading) return <Spinner />;

  return (
    <Container className='mt-1'>
      <Nav tabs className='mt-1'>
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
        title={POSITIONS[activeTab]}
        options={{
          pageSize: 10,
        }}
      />
    </Container>
  );
};

export default PlayerStatsPage;
