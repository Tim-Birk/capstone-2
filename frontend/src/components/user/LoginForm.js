import { useState, useContext, useEffect } from 'react';
import UserContext from '../../contexts/UserContext';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const LoginForm = ({ loginUser, error }) => {
  const intialState = {
    username: '',
    password: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(intialState);
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true);
      await loginUser(formData);
      if (user) {
        setFormData(intialState);
        history.push('/player-stats');
      }
      setIsLoading(false);
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };
  return (
    <div className='col-md-4 m-auto'>
      <h2 className='mt-3'>Login</h2>
      <Form className='search-form mt-2' onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            name='username'
            required
            value={formData.username}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            value={formData.password}
            onChange={handleChange}
          />
        </FormGroup>
        {error && error.type === 'login' ? (
          <Alert className='mt-2' color='danger'>
            {error.message}
          </Alert>
        ) : null}

        <Button className='mt-2' disabled={isLoading} color='primary'>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
