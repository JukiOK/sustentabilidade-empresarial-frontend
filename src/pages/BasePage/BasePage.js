import React from 'react';
import Menu from '../../components/Menu/Menu';
import Header from '../../components/Header/Header';
import {Helmet} from 'react-helmet';

require('./basePage.scss');

function BasePage(props) {

  const img = require('../../assets/images/leaves.png');
  return (
    <div className="base-page-container">
      <Helmet defaultTitle={'HIDS-Sustentabilidade Corporativa'} />
      <Menu />
      <div className="base-page-container-content">
        <Header title={props.title}/>
        <div className="base-page-content">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default BasePage;
