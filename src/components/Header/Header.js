import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../redux/actions/userAction';

require('./header.scss');

/**
* Componente para header da pagina.
*/
function Header(props) {

  const dispatch = useDispatch();

  function logout() { //função para fazer o logout através da função do firebase
    firebase.auth().signOut().then(function() {
      dispatch(removeUser());
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

Header.propTypes = {
  /**
  * Titulo do header
  */
  title: PropTypes.string,

}

export default (withRouter)(Header);
