import React, {useContext} from 'react';
import { NavLink} from 'react-router-dom';

import {AuthContext} from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  
  return <ul className="nav-links">
    {/* {auth.isLoggedIn && auth.isAdmin  && (
      <li>
        <NavLink to="/users" exact>ALL USERS</NavLink>
      </li>
    )} */}
    {auth.isLoggedIn && (
      <li>
        <NavLink  to="/places" >สถานที่ท่องเที่ยว</NavLink>
      </li>
     )}
    {auth.isLoggedIn && !auth.isAdmin && (
      <li>
        <NavLink to={`/${auth.userId}/favoritePlaces`} >สถานที่ท่องเที่ยวที่ชื่นชอบ</NavLink>
      </li>
     )}
    {auth.isLoggedIn && auth.isAdmin  && (
      <li>
        <NavLink to={`/${auth.userId}/places`}>สถานที่ท่องเที่ยวของฉัน</NavLink>
      </li>
    )}
    {auth.isLoggedIn && !auth.isAdmin && (
      <li>
        <NavLink to={`/${auth.userId}/plans`}>เเผนท่องเที่ยวของฉัน</NavLink>
      </li>
    )}
    {auth.isLoggedIn && auth.isAdmin  && (
      <li>
        <NavLink to="/places/new">สร้างสถานที่ท่องเที่ยว</NavLink>
      </li>
    )}
    {auth.isLoggedIn && !auth.isAdmin &&  (
      <li>
        <NavLink to="/plans/new">สร้างเเผนท่องเที่ยว</NavLink>
      </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <NavLink to={`/edit/${auth.userId}`}>บัญชีของฉัน</NavLink>
      </li>
    )}
    {!auth.isLoggedIn && (
      <li>
        <NavLink to="/auth">เข้าสู่ระบบ</NavLink>
      </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <button onClick={auth.logout} >ออกจากระบบ</button>
      </li>
      
    )}
  </ul>
};

export default NavLinks;

// onClick={auth.logout}