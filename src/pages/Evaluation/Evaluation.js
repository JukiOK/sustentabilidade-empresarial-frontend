import React from 'react';
import BasePage from '../BasePage/BasePage';
import { getMe } from '../../services/requests';

require('./evaluation.scss');

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
          <span>dimensão</span>

        </div>
      </div>
    </BasePage>
  )
}

export default Evaluation;
