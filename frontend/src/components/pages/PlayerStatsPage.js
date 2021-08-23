import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PlayersContext from '../../contexts/PlayersContext';
import UserContext from '../../contexts/UserContext';
import { Container, Nav, NavItem, NavLink } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MaterialTable from 'material-table';
import Spinner from '../common/Spinner';
import classnames from 'classnames';
import { getTableColumns, getTableData, getSeasonOptions } from '../../helpers';

const useStyles = makeStyles((theme) => ({
  formControl: {
    paddingTop: 10,
  },
  input: {
    height: 40,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const PlayerStatsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [season, setSeason] = useState(new Date().getFullYear() - 1);
  const [activeTab, setActiveTab] = useState('QB');
  const [tablePlayers, setTablePlayers] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const { user } = useContext(UserContext);
  const { playerMap } = useContext(PlayersContext);
  const history = useHistory();
  const classes = useStyles();

  const handleChange = (event) => {
    setSeason(event.target.value);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  async function getPlayers() {
    setTableColumns(getTableColumns(activeTab));
    setTablePlayers(getTableData(playerMap, activeTab, season));

    setIsLoading(false);
  }

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    getPlayers();
  }, [activeTab, season]);

  const seasonOptions = getSeasonOptions();

  if (isLoading) return <Spinner />;

  return (
    <Container className='mt-1' className={classes.formControl}>
      <FormControl variant='outlined'>
        <Select
          value={season}
          onChange={handleChange}
          label='Season'
          className={classes.input}
        >
          {seasonOptions}
        </Select>
      </FormControl>
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
        title={`${activeTab}s`}
        options={{
          pageSize: 10,
        }}
      />
    </Container>
  );
};

export default PlayerStatsPage;
