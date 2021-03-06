import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
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
import ProfileUser from './pages/ProfileUser/ProfileUser';
import Users from './pages/Users/Users';
import OrganizationsList from './pages/OrganizationsList/OrganizationsList';
import EvaluationsList from './pages/EvaluationsList/EvaluationsList';
import EvaluationOrg from './pages/EvaluationOrg/EvaluationOrg';
import EvaluationOrgDimension from './pages/EvaluationOrgDimension/EvaluationOrgDimension';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import InvitesList from './pages/InvitesList/InvitesList';
import Invite from './pages/Invite/Invite';
import PrivacyPolice from './pages/PrivacyPolice/PrivacyPolice';
import { useDispatch } from 'react-redux';
import { userLogout } from './redux/actions/userAction';

export default function Router(props) {

  const [token, setToken] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    //função para verificar se usuário esta logado pelo token do firebase, usando a função onAuthStateChanged do firebase
    firebaseCheckToken().then(async user => {
      var currentToken = null;
      if (user != null){
        currentToken = await user.getIdToken();
        setToken(currentToken);
      } else if (!window.location.pathname.includes('login') && window.location.pathname !== '/register' && window.location.pathname !== '/recoverpassword') { //Redireciona para tela de login se token for invalido
        alert("Desculpe, sua sessão expirou. Por favor entre novamente.");
        dispatch(userLogout());
        let path = encodeURIComponent(window.location.pathname);
        window.location.href = "/login?previous=" + path;
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/evaluation" />
        <Route exact path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/verifyemail" component={VerifyEmail}/>
        <Route path="/recoverpassword" component={RecoverPassword} />
        <Route exact path="/evaluation" component={Evaluation} />
        <Route path="/evaluation/form/:id" component={FormEvaluation} />
        <Route path="/organizationprofile" component={OrganizationProfile} />
        <Route exact path="/dimensions" component={Dimensions} />
        <Route path="/dimensions/form/:id" component={DimensionForm} />
        <Route path="/report" component={Report} />
        <Route path="/userprofile" component={ProfileUser} />
        <Route path="/users" component={Users} />
        <Route path="/organizations" component={OrganizationsList} />
        <Route exact path="/testslist" component={EvaluationsList} />
        <Route exact path="/testslist/:orgId?/:evaluationId?/:year?" component={EvaluationOrg} />
        <Route path="/testslist/form/:id/:orgId?/:evaluationId?" component={EvaluationOrgDimension} />
        <Route exact path="/invites" component={InvitesList} />
        <Route path="/invites/:id" component={Invite} />
        <Route path="/privacypolice" component={PrivacyPolice} />
      </Switch>
    </BrowserRouter>
  )
}
