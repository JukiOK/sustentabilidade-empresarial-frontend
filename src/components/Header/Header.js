import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../redux/actions/userAction';

require('./header.scss');

/**
* Componente para header da pagina.
*/
function Header(props) {

  const dispatch = useDispatch();

  function logout() { //função para fazer o logout através da função do firebase
    firebase.auth().signOut().then(function() {
      dispatch(userLogout());
      props.history.push('/login');
    }).catch(function(error) {
      // An error happened.
    });
  }

  function handleBack() {
    props.history.goBack();
  }

  return (
    <div className="header-container">
      {
        props.backBtn &&
        <FontAwesomeIcon icon={faArrowLeft} className="icon-header back" onClick={handleBack}/>
      }
      <span className="header-title">{props.title}</span>
      <FontAwesomeIcon icon={faSignOutAlt} className="icon-header logout" onClick={logout}/>
    </div>
  )
}

Header.propTypes = {
  /**
  * Titulo do header
  */
  title: PropTypes.string,
  /**
  * Se tem botão de voltar
  */
  backBtn: PropTypes.bool,

}

export default (withRouter)(Header);
