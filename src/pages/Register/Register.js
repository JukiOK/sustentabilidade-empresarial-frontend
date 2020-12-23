import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';
import InputMask from 'react-input-mask';
import firebase from 'firebase';
import { createUser } from '../../services/requests';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/actions/userAction';

require('./register.scss');

/**
* Componente para página de registrar novo usuário.
*/

function Register(props) {

  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [textErrorEmail, setTextErrorEmail] = useState('');
  const [textErrorPass, setTextErrorPass] = useState('');
  const dispatch = useDispatch();

  function registerUser() {
    if(pass !== confirm) { //confirmação de senha
      setError(true);
      setTextErrorPass('As senhas não são as mesmas');
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then(async (info) => {
        let data = await createUser({firstName, lastName, email, phone});
        dispatch(setUser(data));
        if(info.user.emailVerified) {
          props.history.push('/organizationprofile');
        } else {
          props.history.push('/verifyemail');
        }
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        //tratamento dos erros de cadastramento
        if(error.code === 'auth/email-already-in-use') {
          setErrorEmail(true);
          setTextErrorEmail('O email já esta sendo utilizado');
        } else if(error.code === 'auth/invalid-email') {
          setErrorEmail(true);
          setTextErrorEmail('O email é inválido');
        } else if(error.code === 'auth/weak-password') {
          setError(true);
          setTextErrorPass('A senha deve ter no mínimo 6 caracteres');
        } else {
          console.log(error);
        }
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
          <span>Telefone</span>
        </div>
        <InputMask mask="(99) 9999-9999" maskChar="_"  onChange={e => setPhone(e.target.value)}/>
        <div className="input-title">
          <span>Email</span>
        </div>
        <input onChange={e => setEmail(e.target.value)} onFocus={() => setTextErrorEmail(false)}></input>
        {
          errorEmail &&
          <div className="error-text">{textErrorEmail}</div>
        }
        <div className="input-title">
          <p>A senha deve ter no mínimo 6 caracteres</p>
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
            {textErrorPass}
          </div>
        }
        <div className="btn-confirm" onClick={registerUser}>
          <span className="register-text">Finalizar cadastro</span>
        </div>
        <div className="text-container">
          <span>Já possui uma conta?</span>
          <a href={'/login'}>Faça o login</a>
        </div>
      </div>
    </BasePageLogin>
  )
}

export default Register;
