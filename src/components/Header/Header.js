import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';

require('./header.scss');

function Header(props) {

  function logout() {
    firebase.auth().signOut().then(function() {
      props.history.push('/');
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
