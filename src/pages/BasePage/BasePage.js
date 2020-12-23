import React from 'react';
import Menu from '../../components/Menu/Menu';
import Header from '../../components/Header/Header';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import firebase from 'firebase';

require('./basePage.scss');
/**
* Componente com design da tela base, com header e menu.
*/

function BasePage(props) {

  const img = require('../../assets/images/leaves.png');

  return (
    <div className="base-page-container">

      <Helmet defaultTitle={'HIDS-Sustentabilidade Corporativa'}/>
      <Menu />
      <div className="base-page-container-content">
        <Header title={props.title} backBtn={props.backBtn}/>
        <div className="base-page-content">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default BasePage;

BasePage.propTypes = {
  /**
  * Título do Header
  */
  title: PropTypes.string,
  /**
  * Se tem botão de voltar
  */
  backBtn: PropTypes.bool,
}
