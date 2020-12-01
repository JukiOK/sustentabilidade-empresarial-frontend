import React from 'react';
import BasePage from '../BasePage/BasePage';

require('./report.scss');

function Report(props) {

  return (
    <BasePage
      title={'Avaliação'}
    >
      <div className="report-container">
        <span className="report-title">Pontuação geral</span>
        <div className="report-container-general">
          <div className="report-container-info">
            <span>Pontuação geral</span>
            <span>Saiba mais</span>
          </div>
        </div>
        <span className="report-title">Pontuação por dimensão</span>
        <div className="row">
          <div className="dimension-card">
            <div>
              <p className="dimension-name">dimensão</p>
              <span>critérios</span>
              <span>0/5</span>
            </div>

          </div>
        </div>
      </div>
    </BasePage>
  )
}

export default Report;
