import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import OrganizationProfile from './pages/OrganizationProfile/OrganizationProfile';
import RecoverPassword from './pages/RecoverPassword/RecoverPassword';
import {firebaseImpl} from './utils/firebaseUtils';
import firebase from 'firebase';
import Dimensions from './pages/Dimensions/Dimensions';

export default function Router(props) {

  const [token, setToken] = useState();

  useEffect(() => {
    firebaseImpl().then(async user => {
      var currentToken = null;
      if (user != null){
        currentToken = await user.getIdToken();
        setToken(currentToken);
        console.log(firebase.auth().currentUser);
      }else if (window.location.pathname !== '/' && window.location.pathname !== '/register' && window.location.pathname !== '/recoverpassword') { //Redirect to login screen
        alert("Desculpe, sua sessão expirou. Por favor entre novamente.");
        window.location.href = "/"
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/recoverpassword" component={RecoverPassword} />
        {
          token &&
          <>
            <Route path="/organizationprofile" component={OrganizationProfile} />
            <Route path="/dimensions" component={Dimensions} />            
          </>
        }
      </Switch>
    </BrowserRouter>
  )
}
