import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';

require('./recoverPassword.scss');

function RecoverPassword(props) {

  const [email, setEmail] = useState('');

  function sendRecover() {
    props.history.goBack();
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
        <div className="btn-confirm" onClick={sendRecover}>
          <span className="recover-password-text">Recuperar senha</span>
        </div>
        <div className="text-container">
          <span>Já possui uma conta?</span>
          <a href={'/login'}>Faça login</a>
        </div>

      </div>
    </BasePageLogin>
  )
}

export default RecoverPassword;
