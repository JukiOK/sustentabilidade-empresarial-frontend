import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';

require('./login.scss');

function Login(props) {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  function login() {
    props.history.push('/organizationprofile')
  }

  return (
    <BasePageLogin>
      <div className="login-container">
        <div>
          <span>Faça login para continuar:</span>
        </div>
        <div style={{marginTop: '40px', marginBottom: '10px'}}>
          <span>Email</span>
        </div>
        <input onChange={e => setEmail(e.target.value)}></input>
        <div style={{marginTop: '20px', marginBottom: '10px'}}>
          <span>Senha</span>
        </div>
        <input type="password" onChange={e => setPass(e.target.value)}></input>
        <div className="login-btn btn-confirm" onClick={login}>
          <span className="login-text">Entrar</span>
        </div>
        <div className="text-container">
          <span>Esqueceu sua senha?</span>
          <a href={'/recoverpassword'}>Recupere-a</a>
        </div>
        <div className="text-container">
          <span>Ainda não possui uma conta?</span>
          <a href={'/register'}>Registre-se</a>
        </div>
      </div>
    </BasePageLogin>
  )
}

export default Login;
