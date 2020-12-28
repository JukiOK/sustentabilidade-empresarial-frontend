import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature, faFileAlt, faBuilding, faUserCircle, faUsers, faCity, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import colorsobject from '../../constants/colorsobject';
import { getMe } from '../../services/requests';
import { useSelector, useDispatch } from 'react-redux';
import { getInvitesList } from '../../services/requests';
import { setHasNew,setInvites } from '../../redux/actions/invitesAction';

require ('./menu.scss');

/**
* Componente para o menu lateral.
*/

function Menu(props) {
  const hids = require('../../assets/images/logohids.png');
  const unicamp = require('../../assets/images/UNICAMP_logo.png');
  const url = window.location.href;
  const user = useSelector(state => state.user.userInfo || {});
  const invitesList = useSelector(state => state.invites && state.invites.list);
  const hasNew = useSelector(state => state.invites && state.invites.hasNew);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval;
    if(user) {
      interval = setTimeout(getInvites, 60000);
    }
    console.log(interval);
    return (() => {
      clearTimeout(interval);
    })
  }, [user, invitesList]);

  async function getInvites() {
    getInvitesList().then((data) => {
      let sent = [];
      let receive = [];
      for(let i = 0; i < data.length; i++) {
        let invite;
        console.log(invitesList, 'a');
        if(invitesList && invitesList.sent) {
          invite = invitesList.sent.find(x => x._id === data[i]._id);
        }
        if(user.email === data[i].toUserEmail){
          receive.push(data[i]);
          //checar se tem algum convite recebido não visto
          if(!hasNew && !data[i].seen && !url.includes('/invites')) { //se já não tem uma notificação verifica se precisa notificar usuário de novos convites
            dispatch(setHasNew(true));
          }
        } else if(user.email === data[i].fromUserEmail) {
          sent.push(data[i]);
          //checar se convite enviado foi aceito
          if(!hasNew && invite && !invite.accepted && data[i].accepted && !url.includes('/invites')) { //se já não tem uma notificação verifica se precisa notificar usuário de novos convites
            dispatch(setHasNew(true));
          }
        }
      }
      dispatch(setInvites({sent, receive}));
    });
  }

  console.log(hasNew, invitesList, 'bla');

  //itens do menu, com url, nome e icone, e se pode ser acessado somente com a permissão de administrador
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
      name: 'Minha instituição',
      path: '/organizationprofile',
      icon: (<FontAwesomeIcon icon={faBuilding} className="icon-menu"/>)
    },
    {
      name: 'Convites',
      path: '/invites',
      icon: (<FontAwesomeIcon icon={faEnvelope} className="icon-menu"/>)
    },
    {
      name: 'Meu perfil',
      path: '/userprofile',
      icon: (<FontAwesomeIcon icon={faUserCircle} className="icon-menu"/>),
    },
    {
      name: 'Versões',
      path: '/dimensions',
      icon: (<FontAwesomeIcon icon={faFileSignature} className="icon-menu"/>),
      isAdmin: true,
    },
    {
      name: 'Usuários',
      path: '/users',
      icon: (<FontAwesomeIcon icon={faUsers} className="icon-menu"/>),
      isAdmin: true,
    },
    {
      name: 'Instituições',
      path: '/organizations',
      icon: (<FontAwesomeIcon icon={faCity} className="icon-menu"/>),
      isAdmin: true,
    },
    {
      name: 'Avaliações',
      path: '/testslist',
      icon: (<FontAwesomeIcon icon={faFileSignature} className="icon-menu"/>),
      isAdmin: true,
    },
  ];

  return (
    <div className="menu-container">
      <span style={{textAlign: 'center', fontWeight: 'bold', color: '#ffffff'}}>Avaliação de Sustentabilidade Corporativa</span>
      <div className="line"></div>
      <div className="menu-content">
        {
          user &&
          tabs.map((tab, index) => {
            if(!tab.isAdmin || (tab.isAdmin && user.isAdmin)) {
              return (
                <div
                  key={index}
                  className="menu-item"
                  onClick={() => props.history.push(tab.path)}
                  style={{color: url.includes(tab.path) && colorsobject.black}}
                  >
                    {tab.name}
                    {tab.icon}
                    {
                      hasNew && tab.name === 'Convites' &&
                      <div className="notification"></div>
                    }
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
