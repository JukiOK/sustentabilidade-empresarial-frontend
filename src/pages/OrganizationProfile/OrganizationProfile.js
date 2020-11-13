import React from 'react';
import BasePage from '../BasePage/BasePage';
import InputMask from 'react-input-mask';

require('./organizationProfile.scss');

function OrganizationProfile(props) {
  return (
    <BasePage>
      <div className="profile-container">
        <div>
          <span>Identificação da instituição</span>
        </div>
        <input placeholder="Nome da instituição" />
        <div className="profile-row">
          <InputMask mask="(99) 9999-9999" maskChar="_" placeholder="Telefone"/>
          <input placeholder="Site" style={{marginLeft: '10px'}}/>
        </div>
        <input placeholder="Endereço principal" />
        <div className="profile-row">
          <select className="profile-select">
            <option value="" disabled selected hidden>País</option>
            <option>bla</option>
          </select>
          <select>
            <option value="" disabled selected hidden>Estado</option>
            <option>bla</option>
          </select>
          <select>
            <option value="" disabled selected hidden>Cidade</option>
            <option>bla</option>
          </select>
          <InputMask mask="999.999.999-99" maskChar="_"  placeholder="CEP" style={{marginLeft: '5px'}}/>
        </div>
        <div className="profile-title">
          <span>Atividade</span>
          <p style={{margin: '10px 0px'}}>Se sua empresa atua em vários setores, selecione a opção que melhor representa a maior atividade operacional da empresa em termos de receita geral</p>
        </div>
        <select className="profile-select">
          <option value="" disabled selected hidden>Categoria</option>
          <option>bla</option>
        </select>
        <select>
          <option value="" disabled selected hidden>Setor</option>
          <option>bla</option>
        </select>
        <div className="profile-title size-title">
          <span>Porte da instituição</span>
        </div>
        <select className="profile-select">
          <option value="" disabled selected hidden>Número de funcionários</option>
          <option>bla</option>
        </select>
        <div className="btn-confirm">
          <span className="text">Salvar</span>
        </div>
      </div>
    </BasePage>
  )
}

export default OrganizationProfile;
