import './PlayerDetailInjuryNews.css';

const PlayerDetailInjuryNews = ({ player }) => {
  if (player.injuries.length === 0) return null;
  return (
    <div className='detail news-container row mt-2'>
      <p>
        <strong>Latest news:</strong> {player.injuries[0].longComment}
      </p>
    </div>
  );
};

export default PlayerDetailInjuryNews;
