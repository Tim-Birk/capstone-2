import './PlayerCompareMetric.css';

const PlayerCompareMetric = ({ label, statA, statB, isInverse = false }) => {
  statA = statA || 0;
  statB = statB || 0;
  const statAgreater = statA > statB;
  if (label.includes('TD')) {
    statA /= 100;
    statB /= 100;
  }
  return (
    <div className='metric-container mt-2' key={label}>
      <h5 className='text-center'>{label}</h5>
      <div className='row pt-2 pb-4 mx-5'>
        <div className='col-6 text-center'>
          <span
            className={`stat${
              statAgreater ? (isInverse ? ' text-danger' : ' text-success') : ''
            }`}
          >
            {statA.toLocaleString('en-US')}
          </span>
        </div>
        <div className='col-6 text-center'>
          <span
            className={`stat${
              !statAgreater
                ? isInverse
                  ? ' text-danger'
                  : ' text-success'
                : ''
            }`}
          >
            {statB.toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerCompareMetric;
