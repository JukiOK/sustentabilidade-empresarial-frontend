import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';
import InputMask from 'react-input-mask';

require('./register.scss');

function Register(props) {
  return (
    <BasePageLogin>
      <div className="register-container">
        <span>Faça seu cadastro:</span>
        <div style={{marginTop: '40px', marginBottom: '10px'}}>
          <span>Nome</span>
        </div>
        <input></input>
        <div className="input-title">
          <span>Email</span>
        </div>
        <input></input>
        <div className="input-title">
          <span>Telefone</span>
        </div>
        <InputMask mask="(99) 9999-9999" maskChar="_" />
        <div className="input-title">
          <span>Senha</span>
        </div>
        <input type="password"></input>
        <div className="input-title">
          <span>Confirmar senha</span>
        </div>
        <input type="password"></input>
        <div className="btn-confirm" onClick={() => props.history.push('/')}>
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
