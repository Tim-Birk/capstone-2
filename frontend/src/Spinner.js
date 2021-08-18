import React from 'react';
import { Spinner } from 'reactstrap';
const LoadingSpinner = (props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Spinner
        style={{ width: '3rem', height: '3rem', margin: '5rem auto' }}
        color='primary'
      >
        {''}
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
