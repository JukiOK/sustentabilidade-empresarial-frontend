import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import OrganizationProfile from './pages/OrganizationProfile/OrganizationProfile';

export default (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/organizationprofile" component={OrganizationProfile} />
    </Switch>
  </BrowserRouter>
)
