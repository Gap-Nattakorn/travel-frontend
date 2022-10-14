import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import UpdateUser from './user/pages/UpdateUser';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components//Navigation/MainNavigation';
import {AuthContext} from './shared/context/auth-context';
import {useAuth} from './shared/hooks/auth-hook';
import SearchPlaces from './places/pages/SearchPlaces';
import PlaceDetail from './places/pages/PlaceDetail';
import NewPlan from './plans/pages/NewPlan';
import UserPlans from './plans/pages/UserPlans';
import Home from './home/pages/Home';
import PlanDetail from './plans/pages/PlanDetail';
import UpdatePlan from './plans/pages/UpdatePlan';
import FavoritePlaces from './places/pages/FavoritePlaces';


const App = () => {
  const {token, login, logout, userId, userName, isAdmin } = useAuth();
  let routes;
  

  if(token) {
    routes = (
      <Switch>
        <Route path="/" exact> 
          <Home/>
        </Route>
        <Route path="/users" exact> 
          <Users/>
        </Route>
        <Route path="/places" exact> 
          <SearchPlaces/>
        </Route>
        <Route path="/placeDetail/:placeId" > 
          <PlaceDetail/>
        </Route>
        <Route path="/planDetail/:planId" > 
          <PlanDetail/>
        </Route>
        <Route path="/:userId/places" exact> 
          <UserPlaces/>
        </Route>
        <Route path="/:userId/plans" exact> 
          <UserPlans/>
        </Route>
        <Route path="/:userId/favoritePlaces" exact> 
          <FavoritePlaces/>
        </Route>
        <Route path="/places/new" exact> 
          <NewPlace/>
        </Route>
        <Route path="/plans/new" exact> 
          <NewPlan/>
        </Route>
        <Route path="/places/:placeId" >
          <UpdatePlace />
        </Route>
        <Route path="/plans/:planId" >
          <UpdatePlan />
        </Route>
        <Route path="/edit/:userId" >
          <UpdateUser />
        </Route>
        {/* <Redirect to="/"/> */}
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        {/* <Redirect  to="/auth"/> */}
      </Switch>
    );
  }

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn: !!token,
        token: token, 
        userId: userId,  
        userName: userName,
        isAdmin: isAdmin === 'admin' ? true : false,  
        login: login, 
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>
         {routes}
        </main> 
      </Router>
    </AuthContext.Provider>
    
  );
}

export default App;

