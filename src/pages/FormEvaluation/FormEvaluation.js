import React, { useState } from 'react';
import BasePage from '../BasePage/BasePage';
import { faTrashAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

require('./formEvaluation.scss');

/**
* Componente para a página da avaliação de 1 dimensão.
*/

function FormEvaluation(props) {

  const [expand, setExpand] = useState(false);

  const img = require('../../assets/images/quadro_geral.png');

  return (
    <BasePage title={'dimensão'}>
      <div className="form-evaluation-container">
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
        <span className="evaluation-title">Critério</span>
        <div className="dimension-card">
          {
            expand ?
            <div>
              <div style={{display: 'flex'}}>
                <span className="dimension-name">nome</span>
                <FontAwesomeIcon icon={faAngleUp} className="icon-arrow" onClick={() => setExpand(false)}/>
              </div>
              <p>bla</p>
              <span>resposta</span>
              <div style={{display: 'flex', marginTop: '10px'}}>
                <div className="btn-confirm btn-attach">Anexar arquivo</div>
                <div className="btn-confirm">Salvar</div>
              </div>
            </div>
            :
            <div style={{display: 'flex'}}>
              <span className="dimension-name">nome</span>
              <FontAwesomeIcon icon={faAngleDown} className="icon-arrow" onClick={() => setExpand(true)}/>
            </div>
          }
        </div>
      </div>
    </BasePage>
  )
}

export default FormEvaluation;
