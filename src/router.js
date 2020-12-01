import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import OrganizationProfile from './pages/OrganizationProfile/OrganizationProfile';
import RecoverPassword from './pages/RecoverPassword/RecoverPassword';
import {firebaseImpl, firebaseCheckToken} from './utils/firebaseUtils';
import firebase from 'firebase';
import Dimensions from './pages/Dimensions/Dimensions';
import DimensionForm from './pages/DimensionForm/DimensionForm';
import Evaluation from './pages/Evaluation/Evaluation';
import Report from './pages/Report/Report';
import FormEvaluation from './pages/FormEvaluation/FormEvaluation';

export default function Router(props) {

  const [token, setToken] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    firebaseCheckToken().then(async user => {
      var currentToken = null;
      if (user != null){
        currentToken = await user.getIdToken();
        console.log(currentToken);
        setToken(currentToken);
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
        <Route exact path="/evaluation" component={Evaluation} />
        <Route path="/evaluation/:id" component={FormEvaluation} />
        <Route path="/organizationprofile" component={OrganizationProfile} />
        <Route exact path="/dimensions" component={Dimensions} />
        <Route path="/dimensions/form/:id" component={DimensionForm} />
        <Route path="/report" component={Report} />
      </Switch>
    </BrowserRouter>
  )
}
