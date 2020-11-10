import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';

require('./header.scss');

function Header(props) {

  function logout() {
    props.history.push('/login');
  }

  return (
    <div className="header-container">
      <span className="header-title">{props.title}</span>
      <FontAwesomeIcon icon={faSignOutAlt} className="icon-header" onClick={logout}/>
    </div>
  )
}

export default (withRouter)(Header);
