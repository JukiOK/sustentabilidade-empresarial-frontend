import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature, faFileAlt, faBuilding, faUserCircle, faUsers, faCity } from '@fortawesome/free-solid-svg-icons';
import colorsobject from '../../constants/colorsobject';
import { getMe } from '../../services/requests';
import firebase from 'firebase';

require ('./menu.scss');

function Menu(props) {
  const hids = require('../../assets/images/logohids.png');
  const unicamp = require('../../assets/images/UNICAMP_logo.png');
  const url = window.location.href;

  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    getInfo();
  }, []);

  async function getInfo() {
    let data = await getMe();
    if(data) {
      setIsAdmin(data.isAdmin);
    }
  }

  function logout() {
    firebase.auth().signOut().then(function() {
      props.history.push('/login');
    }).catch(function(error) {
      // An error happened.
    });
  }

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
    },
    {
      name: 'Meu perfil',
      path: '/userprofile',
      icon: (<FontAwesomeIcon icon={faUserCircle} className="icon-menu"/>),
    },
    {
      name: 'Dimensões',
      path: '/dimensions',
      icon: (<FontAwesomeIcon icon={faFileSignature} className="icon-menu"/>),
      isAdm: true,
    },
    {
      name: 'Usuários',
      path: '/users',
      icon: (<FontAwesomeIcon icon={faUsers} className="icon-menu"/>),
      isAdmin: true,
    },
    {
      name: 'Organizações',
      path: '/organizations',
      icon: (<FontAwesomeIcon icon={faCity} className="icon-menu"/>),
      isAdmin: true,
    },
  ];

  return (
    <div className="menu-container">
      <span style={{textAlign: 'center', fontWeight: 'bold', color: '#ffffff'}}>Avaliação de Sustentabilidade Corporativa</span>
      <div className="line"></div>
      <div className="menu-content">
        {
          tabs.map((tab, index) => {
            if(!tab.isAdm || (tab.isAdm && isAdmin)) {
              return (
                <div
                  key={index}
                  className="menu-item"
                  onClick={() => props.history.push(tab.path)}
                  style={{color: url.includes(tab.path) && colorsobject.black}}
                  >
                    {tab.name}
                    {tab.icon}
                  </div>
                )
            }
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
