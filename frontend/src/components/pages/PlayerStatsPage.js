import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import UserContext from "../../contexts/UserContext";

import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import MaterialTable from "material-table";
import Spinner from "../common/Spinner";
import classnames from "classnames";
import { COLUMNS, getTableData, POSITIONS } from "../../helpers";

const PlayerStatsPage = ({ players, getAllPlayers }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("QB");
  const [positionMap, setPositionMap] = useState();
  const { user } = useContext(UserContext);
  const history = useHistory();

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    // if (!user) {
    //   history.push('/login');
    // }

    // async function fillTableData() {
    if (players === null) {
      setIsLoading(true);
      getAllPlayers();
      console.log("POSITION MAP . . . .", positionMap);
    } else {
      console.log(players);
      // if (positionMap === undefined) {
      setPositionMap(
        JSON.stringify({
          QB: getTableData(players, "QB"),
          RB: getTableData(players, "RB"),
          WR: getTableData(players, "WR"),
          TE: getTableData(players, "TE"),
        })
      );
      // }
      setIsLoading(false);
    }

    // }

    // fillTableData();
  }, [players]);

  if (isLoading) return <Spinner />;

  return (
    <Container className="mt-1">
      <Nav tabs className="mt-1">
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "QB" })}
            onClick={() => {
              toggleTab("QB");
            }}
          >
            QB
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "RB" })}
            onClick={() => {
              toggleTab("RB");
            }}
          >
            RB
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "WR" })}
            onClick={() => {
              toggleTab("WR");
            }}
          >
            WR
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "TE" })}
            onClick={() => {
              toggleTab("TE");
            }}
          >
            TE
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="QB">
          <MaterialTable
            columns={COLUMNS["QB"]}
            data={JSON.parse(positionMap)["QB"]}
            title={POSITIONS["QB"]}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
        <TabPane tabId="RB">
          <MaterialTable
            columns={COLUMNS["RB"]}
            data={JSON.parse(positionMap)["RB"]}
            title={POSITIONS["RB"]}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
        <TabPane tabId="WR">
          <MaterialTable
            columns={COLUMNS["WR"]}
            data={JSON.parse(positionMap)["WR"]}
            title={POSITIONS["WR"]}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
        <TabPane tabId="TE">
          <MaterialTable
            columns={COLUMNS["TE"]}
            data={JSON.parse(positionMap)["TE"]}
            title={POSITIONS["TE"]}
            options={{
              pageSize: 10,
            }}
          />
        </TabPane>
      </TabContent>
    </Container>
  );
};

const mapDispatch = (dispatch) => ({
  getAllPlayers: dispatch.players.setPlayersAsync,
});

const mapState = (state) => ({
  players: state.players.players,
});

export default connect(mapState, mapDispatch)(PlayerStatsPage);
