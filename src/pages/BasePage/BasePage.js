import React from 'react';
import Menu from '../../components/Menu/Menu';
import Header from '../../components/Header/Header';

require('./basePage.scss');

function BasePage(props) {

  return (
    <div className="base-page-container">
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
