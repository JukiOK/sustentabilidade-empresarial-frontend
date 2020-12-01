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
          <div className="report-circular">
            <span style={{fontSize: '30px'}}>0/100</span>
          </div>
        </div>
        <span className="report-title">Pontuação por dimensão</span>
        <div className="row">
          <div className="dimension-card">
              <p className="dimension-name">dimensão</p>
              <div className="report-circular small-circle">
                <span>0/100</span>
              </div>
              <div style={{display: 'flex', margin: '10px 0px'}}>
                <span>critérios</span>
                <span style={{marginLeft: 'auto'}}>0/5</span>
              </div>
              <span>Saiba como melhorar</span>
          </div>
        </div>
      </div>
    </BasePage>
  )
}

export default Report;
