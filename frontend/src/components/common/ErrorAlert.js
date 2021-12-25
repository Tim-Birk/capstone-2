import Alert from '@mui/material/Alert';

const ErrorAlert = ({ isHidden, msg, setErrorMsg }) => {
  return (
    <Alert
      onClose={() => {
        setErrorMsg(null);
      }}
      hidden={isHidden}
      severity='error'
    >
      {msg}
    </Alert>
  );
};

export default ErrorAlert;
