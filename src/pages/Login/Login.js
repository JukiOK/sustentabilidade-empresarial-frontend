import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';
import firebase from 'firebase';

require('./login.scss');

function Login(props) {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);

  function login() {
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => {
        props.history.push('/organizationprofile');
      }
    )
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      setErr(true);
      // ...
    });
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
        <input onChange={e => setEmail(e.target.value)} onFocus={() => setErr(false)}></input>
        <div style={{marginTop: '20px', marginBottom: '10px'}}>
          <span>Senha</span>
        </div>
        <input type="password" onChange={e => setPass(e.target.value)} onFocus={() => setErr(false)}></input>
        {
          err &&
          <div className="error-text">Email ou senha invalida</div>
        }
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
