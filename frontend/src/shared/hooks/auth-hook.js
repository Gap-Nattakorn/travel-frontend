import {useState, useCallback, useEffect} from 'react';
// import {useHistory} from 'react-router-dom';
let logoutTimer; 

export const useAuth = () => {
   const [token, setToken] = useState(false);
   const [tokenExpirationDate, setTokenExpirationDate] = useState();
   const [userId, setUserId] = useState(false);  
   const [userName, setUserName] = useState(false);  
   const [isAdmin, setIsAdmin] = useState(false);  
  //  const history = useHistory();


   const login = useCallback((uid, userName, status, token, expirationDate) => {
     //console.log(status);
     setToken(token);
     setUserId(uid);
     setUserName(userName);
     setIsAdmin(status);
     const tokenExpirationDate = 
       expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // Auto Logout 1 Hours
     setTokenExpirationDate(tokenExpirationDate);
     localStorage.setItem(
       'userData', 
       JSON.stringify({
         userId: uid,
         token: token,
         userName: userName,
         isAdmin: status ,
         expiration: tokenExpirationDate.toISOString()
       })
     );
   },[]);
   
   const logout = useCallback(() => {
     setToken(null);
     setTokenExpirationDate(null);
     setUserId(null);
     setIsAdmin(null);
     setUserName(null);
     localStorage.removeItem('userData');
    //  history.push('/auth');
   },[]);

   useEffect(() => {
     if (token && tokenExpirationDate) {
       const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
       logoutTimer = setTimeout(logout, remainingTime);
     } else {
       clearTimeout(logoutTimer);
     }
   }, [token, logout, tokenExpirationDate]);

   useEffect(() => {
     const storeData = JSON.parse(localStorage.getItem('userData'));
     if( storeData && 
       storeData.token && 
       new Date(storeData.expiration) > new Date() 
     ) {
       login(storeData.userId, storeData.userName, storeData.isAdmin, storeData.token, new Date(storeData.expiration));
     }
   }, [login]);

   return {token, login, logout, userId, userName, isAdmin};

}