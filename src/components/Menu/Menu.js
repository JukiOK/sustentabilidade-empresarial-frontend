import React from 'react';

require ('./menu.scss');

function Menu(props) {
  const hids = require('../../assets/images/logohids.png');
  const unicamp = require('../../assets/images/UNICAMP_logo.png');

  return (
    <div className="menu-container">
      <span style={{textAlign: 'center', fontWeight: 'bold'}}>Avaliação de Sustentabilidade Corporativa</span>
      <div className="menu-logo-container">
        <img src={hids} style={{height: '68px'}}/>
        <img src={unicamp} style={{height: '68px', marginLeft: 'auto'}}/>
      </div>
    </div>
  )
}

export default Menu;
