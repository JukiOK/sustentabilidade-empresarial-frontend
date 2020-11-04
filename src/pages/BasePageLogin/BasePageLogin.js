import React, { useState, useEffect } from 'react';

require('./basePageLogin.scss');

function BasePageLogin(props) {
  const hids = require('../../assets/images/logohids.png');
  const unicamp = require('../../assets/images/UNICAMP_logo.png');
  return (
    <div className="base-page-login-container">
      <div className="base-page-login-logos">
        <img src={hids} style={{height:'100%'}}/>
        <img src={unicamp} style={{height:'100%', marginLeft: 'auto'}}/>
      </div>
      <div style={{display: 'flex'}}>
        <div className="base-page-login-title">
          <h2>Avaliação de Sustentabilidade Corporativa</h2>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default BasePageLogin;
