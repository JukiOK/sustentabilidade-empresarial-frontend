import React from 'react';
import BasePage from '../BasePage/BasePage';

require('./dimensionForm.scss');

function DimensionForm(props) {
  return (
    <BasePage title={'Formulário da dimensão'}>
      <div className="dimension-form-container">
        <span className="dimension-form-title">Informações gerais</span>
        <div className="dimension-form-card">
          <div>
            <input placeholder="Nome"></input>
            <input placeholder="Código"></input>
          </div>
          <input placeholder="Descrição"></input>
        </div>
        <span className="dimension-form-title">Critérios</span>
      </div>
    </BasePage>
  )
}

export default DimensionForm;
