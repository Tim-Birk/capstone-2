import LinearProgress from '@mui/material/LinearProgress';

const ProgressBar = ({ message }) => {
  return (
    <div>
      <h6 class='text-center text-bold'>{message}</h6>
      <LinearProgress />
    </div>
  );
};

export default ProgressBar;
