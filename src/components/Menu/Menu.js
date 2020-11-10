import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature, faFileAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import colorsobject from '../../constants/colorsobject';

require ('./menu.scss');

function Menu(props) {
  const hids = require('../../assets/images/logohids.png');
  const unicamp = require('../../assets/images/UNICAMP_logo.png');
  const url = window.location.href;

  const tabs = [
    {
      name: 'Avaliação',
      path: '/evaluation',
      icon: (<FontAwesomeIcon icon={faFileSignature} className="icon-menu"/>)
    },
    {
      name: 'Relatório',
      path: '/report',
      icon: (<FontAwesomeIcon icon={faFileAlt} className="icon-menu"/>)
    },
    {
      name: 'Instituição',
      path: '/organizationprofile',
      icon: (<FontAwesomeIcon icon={faBuilding} className="icon-menu"/>)
    }
  ];

  return (
    <div className="menu-container">
      <span style={{textAlign: 'center', fontWeight: 'bold'}}>Avaliação de Sustentabilidade Corporativa</span>
      <div className="line"></div>
      <div className="menu-content">
        {
          tabs.map((tab, index) => {
            return (
              <div
                key={index}
                className="menu-item"
                onClick={() => props.history.push(tab.path)}
                style={{color: url.includes(tab.path) && colorsobject.darkgray}}
              >
                {tab.icon}
                {tab.name}
              </div>
            )
          })
        }
      </div>
      <div className="menu-logo-container">
        <img src={hids} style={{height: '68px'}}/>
        <img src={unicamp} style={{height: '68px', marginLeft: 'auto'}}/>
      </div>
    </div>
  )
}

export default (withRouter)(Menu);
