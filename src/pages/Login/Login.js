import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';
import firebase from 'firebase';
import { paramFromUrl } from '../../utils/functions';

require('./login.scss');

/**
* Componente para a página de login.
*/

function Login(props) {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);

  function login() {
    //login com firebase
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => {
        //retorna para página em que foi deslogado
        let path = paramFromUrl();
        path = (path.previous && decodeURIComponent(path.previous) )|| '/evaluation';
        props.history.push(path);
      }
    )
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
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
