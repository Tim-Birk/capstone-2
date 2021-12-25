import React, { useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { NavLink as Link, useHistory } from 'react-router-dom';
import './NavBar.css';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem,
  Container,
} from 'reactstrap';

const NavBar = ({ logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const toggle = () => setIsOpen(!isOpen);

  const mobileToggle = () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setIsOpen(!isOpen);
    }
  };

  const handleLogout = () => {
    logout();
    history.push('/');
    mobileToggle();
  };

  return (
    <div>
      <Navbar color='dark' dark expand='md'>
        <Container>
          <NavbarBrand href='/'>Fantasy Football Assistant</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className='mr-auto' navbar>
              {user ? (
                <>
                  <Link to='/player-stats'>
                    <NavItem>
                      <NavLink onClick={() => mobileToggle()}>
                        Player Stats
                      </NavLink>
                    </NavItem>
                  </Link>
                  <Link to='/my-rankings'>
                    <NavItem>
                      <NavLink onClick={() => mobileToggle()}>
                        My Rankings
                      </NavLink>
                    </NavItem>
                  </Link>
                  <Link to='/profile'>
                    <NavItem>
                      <NavLink onClick={() => mobileToggle()}>Profile</NavLink>
                    </NavItem>
                  </Link>
                  <NavItem>
                    <NavLink onClick={handleLogout}>Logout</NavLink>
                  </NavItem>
                </>
              ) : (
                <>
                  <Link to='/login'>
                    <NavItem>
                      <NavLink>Login</NavLink>
                    </NavItem>
                  </Link>
                  <Link to='/signup'>
                    <NavItem>
                      <NavLink>Sign up</NavLink>
                    </NavItem>
                  </Link>
                </>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
