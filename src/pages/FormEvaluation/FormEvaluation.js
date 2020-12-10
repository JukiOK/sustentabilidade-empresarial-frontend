import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { faTrashAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { getEvaluationsUser, getDimension, getAllCriteriaDimension, getAllIndicatorsCriterion } from '../../services/requests';

require('./formEvaluation.scss');

function Indicator(props) {
  const [expand, setExpand] = useState(false);
  const [newAnswers, setNewAnswers] = useState([]);
  const { indicator } = props;

  function typeAnswer() {

  }

  return (
    <div className="indicator-card">
      {
        expand ?
        <div>
          <div style={{display: 'flex'}}>
            <span className="indicator-name">{indicator.name}</span>
            <FontAwesomeIcon icon={faAngleUp} className="icon-arrow" onClick={() => setExpand(false)}/>
          </div>
          <p>{indicator.question.title}</p>
          <p>{indicator.question.instruction}</p>
          {
            typeAnswer(indicator.question.type)
          }
          <span>resposta</span>
          <div style={{display: 'flex', marginTop: '10px'}}>
            <div className="btn-confirm btn-attach">Anexar arquivo</div>
            <div className="btn-confirm">Salvar</div>
          </div>
        </div>
        :
        <div style={{display: 'flex'}}>
          <span className="dimension-name">{indicator.name}</span>
          <FontAwesomeIcon icon={faAngleDown} className="icon-arrow" onClick={() => setExpand(true)}/>
        </div>
      }
    </div>
  )
}

/**
* Componente para a página da avaliação de 1 dimensão.
*/

function FormEvaluation(props) {

  const [dimension, setDimension] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [indicatorsList, setIndicatorsList] = useState();
  const [pointsGeneral, setPointsGeneral] = useState(0);
  const [progressGeneral, setProgressGeneral] = useState(0);
  const [evaluationId, setEvaluationId] = useState('');
  const params = useParams();
  const img = require('../../assets/images/quadro_geral.png');

  useEffect(() => {
    getEvaluationInfo();
  }, [])

  async function getEvaluationInfo() {
    let data1 = await getDimension(params.id);
    let data = await getEvaluationsUser(data1.year);
    setEvaluationId(data._id);
    let answersList = {};
    let evaluation = data[0];
    if(evaluation.answers && evaluation.answers.length > 0) {
      for(let i = 0; i < evaluation.answers.length; i++) { //guarda as respostas pelo id de seu indicador
        answersList[evaluation.answers[i].indicatorId] = evaluation.answers[i];
      }
    }
    console.log(answersList);

    let data2 = await getAllCriteriaDimension(data1._id);
    let maxProgress = 0; //progresso total da dimensão
    let pointDimension = 0; //pontuação da dimensão
    let progressDimension = 0; //progresso da dimensão
    let indicators = {};
    for(let j = 0; j < data2.length; j++) {
      let data3 = await getAllIndicatorsCriterion(data2[j].dimensionId, data2[j]._id);
      let pointCriterion = 0; //pontuação do critério
      maxProgress += data3.length; //progresso maximo da dimensão será a quantidade total de indicadores
      if(evaluation.answers && evaluation.answers.length > 0) {
        for(let k = 0; k < data3.length; k++) {
          let pointIndicator = 0; //pontuação do indicador
          if(answersList[data3[k]._id]) { //se existe a resposta do indicador soma a pontuação da resposta, e o progresso na dimensão
            let answersIndicator = answersList[data3[k]._id].answer;
            for(let l = 0; l < answersIndicator.length; l++) {
              let ind = answersList[data3[k]._id].answer[l].ansId;
              pointDimension += data3[k].weight * data3[k].question.options[ind].points;
              pointCriterion += data3[k].weight * data3[k].question.options[ind].points;
              pointIndicator += data3[k].weight * data3[k].question.options[ind].points;
            }
            progressDimension += 1;
            console.log(pointDimension);
            data3[k].answer = answersList[data3[k]._id].answer;
          }
          data3[k].points = pointIndicator;
        }
      }
      indicators[data2[j]._id] = data3; //guardar indicadores pelo id do critério para facilitar alterar o state
      data2[j].point = pointCriterion;
    }
    setProgressGeneral((progressDimension * 100/maxProgress).toFixed(2));
    setDimension(data1);
    setCriteriaList(data2);
    console.log(indicators, 'bla');
    setPointsGeneral(pointDimension);
    setIndicatorsList(indicators);
  }

  console.log(indicatorsList, criteriaList);

  return (
    <BasePage title={dimension.name}>
      <div className="form-evaluation-container">
        <span className="evaluation-title">Quadro Geral</span>
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
        {
          criteriaList.map((criterion, index) => {
            return (
              <div key={index}>
                <span className="evaluation-title">{criterion.name}</span>
                {
                  indicatorsList && indicatorsList[criterion._id].map((indicator, index) => (
                    <Indicator key={index} indicator={indicator}/>
                  ))
                }

              </div>
            )
          })
        }

      </div>
    </BasePage>
  )
}

export default FormEvaluation;
