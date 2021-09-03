import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import PlayersContext from '../../contexts/PlayersContext';
import UserContext from '../../contexts/UserContext';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import MaterialTable from 'material-table';
import Spinner from '../common/Spinner';
import classnames from 'classnames';
import { COLUMNS, getTableData, POSITIONS } from '../../helpers';

const PlayerStatsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('QB');
  const [positionMap, setPositionMap] = useLocalStorage('positionMap');
  // const [quarterbacks, setQuarterbacks] = useState([]);
  // const [runningBacks, setRunningBacks] = useState([]);
  // const [wideReceivers, setWideReceivers] = useState([]);
  // const [tightEnds, setTightEnds] = useState([]);
  const { user } = useContext(UserContext);
  const { playerMap } = useContext(PlayersContext);
  const history = useHistory();

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    async function fillTableData() {
      // let qbs, rbs, wrs, tes;
      if (!positionMap) {
        const qbs = getTableData(playerMap, 'QB');
        const rbs = getTableData(playerMap, 'RB');
        const wrs = getTableData(playerMap, 'WR');
        const tes = getTableData(playerMap, 'TE');
        setPositionMap(JSON.stringify({ QB: qbs, RB: rbs, WR: wrs, TE: tes }));
      } else {
        // qbs = JSON.parse(positionMap)['QB'];
        // rbs = JSON.parse(positionMap)['RB'];
        // wrs = JSON.parse(positionMap)['WR'];
        // tes = JSON.parse(positionMap)['TE'];
      }
      // setQuarterbacks(qbs);
      // setRunningBacks(rbs);
      // setWideReceivers(wrs);
      // setTightEnds(tes);

      setIsLoading(false);
    }

    fillTableData();
  }, [history, playerMap, positionMap, setPositionMap, user]);

  if (isLoading) return <Spinner />;

  return (
    <Container className='mt-1'>
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
        <TabPane tabId='QB'>
          <MaterialTable
            columns={COLUMNS['QB']}
            data={JSON.parse(positionMap)['QB']}
            title={POSITIONS['QB']}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
        <TabPane tabId='RB'>
          <MaterialTable
            columns={COLUMNS['RB']}
            data={JSON.parse(positionMap)['RB']}
            title={POSITIONS['RB']}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
        <TabPane tabId='WR'>
          <MaterialTable
            columns={COLUMNS['WR']}
            data={JSON.parse(positionMap)['WR']}
            title={POSITIONS['WR']}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
        <TabPane tabId='TE'>
          <MaterialTable
            columns={COLUMNS['TE']}
            data={JSON.parse(positionMap)['TE']}
            title={POSITIONS['TE']}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
      </TabContent>
    </Container>
  );
};

export default PlayerStatsPage;
