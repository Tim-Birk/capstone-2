import { getPostionNameByValue } from '../../helpers';
import './PlayerCompareContainer.css';

const PlayerCompareContainer = ({ player }) => {
  return (
    <div className='compare top-container row'>
      <img
        id='headshot'
        className='compare-headshot'
        src={player.headshot['href']}
        alt={player.headshot['alt']}
      />
      <div className='compare name-info text-center mt-2'>
        <ul className='text-center'>
          <li>
            <img
              className='compare-team-logo'
              src={player.currentTeam.logo.href}
              alt={`${player.currentTeam.teamDisplayName} logo`}
            />
            &nbsp;{getPostionNameByValue(player.position)} #{player.jersey}
          </li>
        </ul>
        <h5>{player.displayName}</h5>
      </div>
    </div>
  );
};

export default PlayerCompareContainer;
