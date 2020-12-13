import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getMe, getAllYears, getEvaluationsUser, getAllDimensions, getAllCriteriaDimension, getAllIndicatorsCriterion } from '../../services/requests';
import PuffLoader from 'react-spinners/PuffLoader';
import colors from '../../constants/colorsobject';

require('./evaluation.scss');

/**
* Componente para página de Avaliação.
*/

function Evaluation(props) {

  const [yearsList, setYearsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [dimensionsList, setDimensionsList] = useState();
  const [pointsGeneral, setPointsGeneral] = useState(0);
  const [progressGeneral, setProgressGeneral] = useState(0);
  const img = require('../../assets/images/quadro_geral.png');

  useEffect(() => {
    getYearsList();
  }, []);

  useEffect(() => {
    if(selectedYear) {
      getEvaluationInfo();
    }
  }, [selectedYear]);

  async function getYearsList() {
    let data = await getAllYears();
    setYearsList(data);
    if(data.length > 0) {
      setSelectedYear(data[data.length-1].year);      
    }
  }

  async function getEvaluationInfo() {
    let data = await getEvaluationsUser(selectedYear);
    let answersList = {};
    let evaluation = data[0];
    if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
      for(let i = 0; i < evaluation.answers.length; i++) { //guarda as respostas pelo id de seu indicador
        answersList[evaluation.answers[i].indicatorId] = evaluation.answers[i];
      }
    }
    console.log(answersList);
    let data1 = await getAllDimensions({year: selectedYear});
    let pointsTotal = 0; //pontuação total da avaliação
    let progressAll = 0; //progresso total da avaliação

    for(let i = 0; i < data1.length; i++) {
      let data2 = await getAllCriteriaDimension(data1[i]._id);
      data1[i].criteriaList = data2;
      let maxProgress = 0; //progresso total da dimensão
      let pointDimension = 0; //pontuação da dimensão
      let progressDimension = 0; //progresso da dimensão
      for(let j = 0; j < data2.length; j++) {
        let data3 = await getAllIndicatorsCriterion(data2[j].dimensionId, data2[j]._id);
        maxProgress += data3.length; //progresso maximo da dimensão será a quantidade total de indicadores
        if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
          for(let k = 0; k < data3.length; k++) {
            if(answersList[data3[k]._id]) { //se existe a resposta do indicador soma a pontuação das respostas, e o progresso na dimensão
              let answersIndicator = answersList[data3[k]._id].answer;
              for(let l = 0; l < answersIndicator.length; l++) { //somar pontuação das respostas
                let ind = answersIndicator[l].ansId;
                pointDimension += data3[k].weight * data3[k].question.options[ind].points;
              }
              progressDimension += 1; //quantidade de indicadores respondidos
              console.log(pointDimension);
            }
          }
        }
      }
      data1[i].progressTotal = maxProgress;
      data1[i].progressDimension = progressDimension;
      data1[i].pointDimension = pointDimension;
      progressAll += maxProgress;
      pointsTotal += pointDimension;
    }
    if(evaluation && evaluation.answers) {
      setProgressGeneral((evaluation.answers.length * 100/progressAll).toFixed(2));
    } else {
      setProgressGeneral(0);
    }
    setDimensionsList(data1);
    setPointsGeneral(pointsTotal);
  }

  return (
    <BasePage
      title={'Avaliação'}
    >
      {
        dimensionsList ?
        <div className="evaluation-container">
          <span className="evaluation-title">Quadro Geral</span>
          <div>
            <span>Selecione o ano da avaliação:</span>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{marginLeft: '10px'}}>
              {
                yearsList.map((year, index) => (
                  <option key={index} value={year.year}>{year.year}</option>
                ))
              }
            </select>
          </div>
          <div className="evaluation-container-general">
            <img src={img} className="img"/>
            <div className="evaluation-container-info">
              <span>Pontuação geral</span>
              <div>
                <span>{pointsGeneral}</span>
              </div>
            </div>
            <div className="evaluation-container-info">
              <span>Progresso total</span>
              <div>
                <span>{progressGeneral}%</span>
              </div>
            </div>
          </div>
          <span className="evaluation-title">Dimensões</span>
          {
            dimensionsList.map((dimension, indexDimension) => (
              <div className="dimension-card" key={indexDimension}>
                <div>
                  <p className="dimension-name">{dimension.name}</p>
                  {
                    dimension.criteriaList.map((criterion, index) => (
                      <p key={index}>{criterion.name}</p>
                    ))
                  }
                </div>
                <div className="dimension-progress">
                  <div>
                    <span>Pontuação </span>
                    <span>{dimension.pointDimension}</span>
                  </div>
                  <div>
                    <span>Progresso </span>
                    <span>{dimension.progressDimension}/{dimension.progressTotal}</span>
                  </div>
                  <div className="btn-confirm" onClick={() => props.history.push('/evaluation/form/' + dimension._id)}>Começar</div>
                </div>
              </div>
            ))
          }

        </div>
        :
        <div className="loader-container">
          <PuffLoader loading={dimensionsList} size={100} color={colors.black}/>
        </div>
      }

    </BasePage>
  )
}

export default Evaluation;
