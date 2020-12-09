import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getMe, getAllYears } from '../../services/requests';

require('./evaluation.scss');

/**
* Componente para página de Avaliação.
*/

function Evaluation(props) {

  const [yearsList, setYearsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const img = require('../../assets/images/quadro_geral.png');

  useEffect(() => {
    getYearsList();
  }, []);

  async function getYearsList() {
    let data = await getAllYears();
    setYearsList(data);
    setSelectedYear(data[data.length-1]);
  }

  return (
    <BasePage
      title={'Avaliação'}
    >
      <div className="evaluation-container">
        <span className="evaluation-title">Quadro Geral</span>
        <div>
          <span>Selecione o ano da avaliação:</span>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {
              yearsList.map((year, index) => (
                <option value={year.year}>{year.year}</option>
              ))
            }
          </select>
        </div>
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
            <div className="btn-confirm" onClick={() => props.history.push('/evaluations/form')}>Começar</div>
          </div>
        </div>
      </div>
    </BasePage>
  )
}

export default Evaluation;
