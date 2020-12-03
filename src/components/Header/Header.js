import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { useCookies } from 'react-cookie';

require('./header.scss');

function Header(props) {

  const [cookies, setCookie] = useCookies(['isAdmin']);

  function logout() {
    firebase.auth().signOut().then(function() {
      setCookie('isAdmin', 'false');
      props.history.push('/login');
    }).catch(function(error) {
      // An error happened.
    });
  }

  return (
    <div className="header-container">
      <span className="header-title">{props.title}</span>
      <FontAwesomeIcon icon={faSignOutAlt} className="icon-header" onClick={logout}/>
    </div>
  )
}

export default (withRouter)(Header);
