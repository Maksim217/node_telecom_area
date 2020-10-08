import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push('/');
  };

  return (
    <nav>
      <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
        <span className="brand-logo">Личный кабинет</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <NavLink to="/profile">Профиль</NavLink>
          </li>
          <li>
            <NavLink to="/detailing">Детализация</NavLink>
          </li>
          <li>
            <NavLink to="/services">Услуги</NavLink>
          </li>
          <li onClick={logoutHandler}>
            <NavLink to="">Выйти</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
