import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';
import InputMask from 'react-input-mask';
import firebase from 'firebase';
import { createUser } from '../../services/requests';

require('./register.scss');

function Register(props) {

  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(false);

  function registerUser() {
    if(pass !== confirm) {
      setError(true);
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then(async () => {
        await createUser({firstName, lastName, email, phone});
        props.history.push('/organizationprofile');
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        alert(error.message);
      });
    }
  }

  return (
    <BasePageLogin>
      <div className="register-container">
        <span>Faça seu cadastro:</span>
        <div style={{marginTop: '40px', marginBottom: '10px'}}>
          <span>Nome</span>
        </div>
        <input onChange={e => setFirstName(e.target.value)}></input>
        <div className="input-title">
          <span>Sobrenome</span>
        </div>
        <input onChange={e => setLastName(e.target.value)}></input>
        <div className="input-title">
          <span>Email</span>
        </div>
        <input onChange={e => setEmail(e.target.value)}></input>
        <div className="input-title">
          <span>Telefone</span>
        </div>
        <InputMask mask="(99) 9999-9999" maskChar="_"  onChange={e => setPhone(e.target.value)}/>
        <div className="input-title">
          <span>Senha</span>
        </div>
        <input type="password" onChange={e => setPass(e.target.value)} onFocus={() => setError(false)}></input>
        <div className="input-title">
          <span>Confirmar senha</span>
        </div>
        <input type="password" onChange={e => setConfirm(e.target.value)} onFocus={() => setError(false)}></input>
        {
          error &&
          <div className="error-text">
            As senhas não são as mesmas.
          </div>
        }
        <div className="btn-confirm" onClick={registerUser}>
          <span className="register-text">Finalizar cadastro</span>
        </div>
        <div className="text-container">
          <span>Já possui uma conta?</span>
          <a href={'/'}>Faça o login</a>
        </div>
      </div>
    </BasePageLogin>
  )
}

export default Register;
