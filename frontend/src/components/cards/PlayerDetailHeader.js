import './PlayerDetailHeader.css';

const PlayerDetailHeader = ({ player }) => {
  return (
    <div className='detail top-container row mt-3'>
      <img
        className='detail-headshot col-md-4'
        src={player.headshot['href']}
        alt={player.headshot['alt']}
      />
      <div className='detail name-info col-md-4 text-center text-md-left'>
        <h3 className='mt-2 mt-md-4'>{player.displayName}</h3>
        <ul>
          <li>
            {player.currentTeam.teamDisplayName}&nbsp;
            <img
              className='detail-team-logo'
              src={player.currentTeam.logo.href}
              alt={`${player.currentTeam.teamDisplayName} logo`}
            />
          </li>
          <li>
            {player.position} - #{player.jersey}
          </li>
        </ul>
      </div>
      <div className='detail other-info col-md-4 text-center text-md-left'>
        <ul className='mt-md-4'>
          <li>Height: {player.displayHeight}</li>
          <li>Weight: {player.displayWeight}</li>
          <li>Age: {player.age}</li>
          <li>Seasons: {player.experience.years}</li>
        </ul>
      </div>
    </div>
  );
};

export default PlayerDetailHeader;
