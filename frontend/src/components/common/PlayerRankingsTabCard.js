import PlayerCompareContainer from '../cards/PlayerCompareContainer';

const PlayerRankingsTabCard = ({ player }) => {
  if (!player) return null;
  return (
    <div style={{ minHeight: '215px' }}>
      <PlayerCompareContainer player={player} />
    </div>
  );
};

export default PlayerRankingsTabCard;
