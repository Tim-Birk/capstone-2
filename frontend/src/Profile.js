import { useState, useContext, useEffect } from 'react';
import UserContext from './UserContext';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const Profile = ({ updateUser, error }) => {
  let intialState = {
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(intialState);
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    // Set formData
    intialState = {
      password: '',
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    };

    setFormData(intialState);
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
      const updateSuccess = await updateUser(formData);
      setIsLoading(false);
      if (updateSuccess) {
        history.push('/');
      }
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };
  return (
    <div className='col-md-4 m-auto'>
      <h2 className='mt-3'>Sign Up</h2>
      <Form className='search-form mt-2' onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor='username'>Username</Label>
          <p>{user ? user.username : ''}</p>
        </FormGroup>
        <FormGroup>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            name='firstName'
            required
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input
            id='lastName'
            name='lastName'
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='password'>Confirm password to make changes:</Label>
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
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default Profile;
