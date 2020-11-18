import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';
import firebase from 'firebase';
import colors from '../../constants/colorsobject';

require('./recoverPassword.scss');

function RecoverPassword(props) {

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function sendRecover() {
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(email).then(function() {
      setSent(true);
    }).catch(function(error) {
      // An error happened.
    });
  }

  return (
    <BasePageLogin>
      <div className="recover-password-container">
        <div>
          <span>Recupere sua senha:</span>
          <p>Um link para recuperação de senha será enviado para o seu email.</p>
        </div>
        <div style={{marginTop: '40px', marginBottom: '10px'}}>
          <span>Email</span>
        </div>
        <input onChange={e => setEmail(e.target.value)}></input>
        {
          sent &&
          <div style={{marginTop: '10px', color: colors.red}}>O email foi enviado</div>
        }
        <button className="btn-confirm recover-btn" onClick={sendRecover} disabled={sent}>
          <span className="recover-password-text">Recuperar senha</span>
        </button>
        <div className="text-container">
          <span>Já possui uma conta?</span>
          <a href={'/'}>Faça login</a>
        </div>

      </div>
    </BasePageLogin>
  )
}

export default RecoverPassword;
