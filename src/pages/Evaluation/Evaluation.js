import React from 'react';
import BasePage from '../BasePage/BasePage';
import { getMe } from '../../services/requests';

require('./evaluation.scss');

/**
* Componente para página de Avaliação.
*/

function Evaluation(props) {

  const img = require('../../assets/images/quadro_geral.png');

  return (
    <BasePage
      title={'Avaliação'}
    >
      <div className="evaluation-container">
        <span className="evaluation-title">Quadro Geral</span>
        <div className="evaluation-container-general">
          <img src={img} className="img"/>
          <div className="evaluation-container-info">
            <span>Pontuação geral</span>
            <div>
              <span>0.0</span>
            </div>
          </div>
          <div className="evaluation-container-info">
            <span>Progresso total</span>
            <div>
              <span>0%</span>
            </div>
          </div>
        </div>
        <span className="evaluation-title">Dimensões</span>
        <div className="dimension-card">
          <div>
            <p className="dimension-name">dimensão</p>
            <p>critérios</p>
          </div>
          <div className="dimension-progress">
            <div>
              <span>Pontuação </span>
              <span>0.0</span>
            </div>
            <div>
              <span>Progresso </span>
              <span>0/10</span>
            </div>
            <div className="btn-confirm" onClick={() => props.history.push('/evaluation/' + 'bla')}>Começar</div>
          </div>
        </div>
      </div>
    </BasePage>
  )
}

export default Evaluation;
