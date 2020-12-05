import React from 'react';
import {Helmet} from 'react-helmet';

require('./basePageLogin.scss');

/**
* Componente para página base das telas de login, registrar e recuperar senha.
*/

function BasePageLogin(props) {
  const hids = require('../../assets/images/hids_preto.png');
  const unicamp = require('../../assets/images/unicamp.png');
  const img = require('../../assets/images/login.png');

  return (
    <div className="base-page-login-container">
      <Helmet defaultTitle={'HIDS-Sustentabilidade Corporativa'} />
      <div className="base-page-login-logos">
        <img src={hids} style={{height:'100%'}}/>
        <img src={unicamp} style={{height:'100%', marginLeft: 'auto'}}/>
      </div>
      <div style={{display: 'flex'}}>
        <div className="base-page-login-title">
          <h2>Avaliação de Sustentabilidade Corporativa</h2>
          <img src={img} style={{width: '70%'}}/>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default BasePageLogin;
