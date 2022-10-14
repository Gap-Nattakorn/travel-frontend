import {createContext} from 'react';
 

export const AuthContext = createContext({
      isLoggedIn: false, 
      userId: null,
      userName: null,
      imageUser: null,
      token: null,
      isAdmin: false,
      login: () => {}, 
      logout: () => {}
});