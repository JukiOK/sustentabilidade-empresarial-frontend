import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { faTrashAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import SaveBtn from '../../components/SaveBtn/SaveBtn';
import {
  getEvaluationsUser, getDimension, getAllCriteriaDimension, getAllIndicatorsCriterion, saveEvaluationsUser, updateEvaluationsUser
} from '../../services/requests';

require('./formEvaluation.scss');

function Indicator(props) {
  const { indicator, saveAnswer } = props;
  const [expand, setExpand] = useState(false);
  const [newAnswers, setNewAnswers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [point, setPoint] = useState(indicator.point);

  useEffect(() => {
    if(indicator.answer) {
      setNewAnswers(indicator.answer);
    }
  }, []);

  function handleChangeAnswer(value, type) {
    console.log(value);
    let aux = newAnswers.slice();
    switch (type) {
      case 'dissertative':
        if(aux.length === 0) {
          aux.push({text: value, ansId: 0});
        } else {
          if(value === '') {
            aux.splice(0, 1);
          } else {
            aux[0].text = value;
          }
        }
        setNewAnswers(aux);
        break;
      case 'binary':
        if(aux.length === 0) {
          aux.push({text: indicator.question.options[value].text, ansId: parseInt(value)});
        } else {
          aux[0].ansId = parseInt(value);
          aux[0].text = indicator.question.options[value].text;
        }
        setPoint(indicator.weight * indicator.question.options[value].points); //alterar pontuação do indicador para pontuação da resposta selecionada
        break;
      case 'multiple':
        let answ = aux.findIndex(x => x.ansId === parseInt(value));
        let newPoint = point; //para questão multipla escolha precisa somar ou subtrair a pontuação
        if(answ !== -1){ //se ja tem a resposta então deve tira-la
          aux.splice(answ, 1);
          newPoint -= indicator.weight * indicator.question.options[value].points;
        } else { //senão adiciona a resposta
          aux.push({ansId: parseInt(value), text: indicator.question.options[value].text})
          newPoint += indicator.weight * indicator.question.options[value].points;
        }
        setPoint(newPoint);
        break;
      default:
        break;
    }
    setNewAnswers(aux);
  }

  function typeAnswer(type) {
    //função com componente para tipo da resposta
    switch (type) {
      case 'dissertative':
        return (
          <input style={{width: '100%'}} value={newAnswers && newAnswers[0] && newAnswers[0].text} onChange={e => handleChangeAnswer(e.target.value, 'dissertative')}/>
        )
        break;
      case 'binary':
        return (
          <div>
            {
              indicator.question.options.map((option, index) => {
                return (
                <div>
                  <input type="radio"
                    name={"option"  + indicator._id} value={index} key={index}
                    checked={newAnswers && newAnswers[0] && newAnswers[0].ansId === index}
                    onChange={e => handleChangeAnswer(e.target.value, 'binary')}
                  />
                  <span className="label-options">{option.text}</span>
                </div>
              )})
            }
          </div>
        )
        break;
      case 'multiple':
        return (
          <div>
            {
              indicator.question.options.map((option, index) => (
                <div>
                  <input type="checkbox" name={"option"  + indicator._id} value={index} key={index}
                    checked={newAnswers && newAnswers.find(x => x.ansId === index)}
                    onChange={e => handleChangeAnswer(e.target.value, 'multiple')}
                  />
                  <span className="label-options">{option.text}</span>
                </div>
              ))
            }
          </div>
        )
        break;
      default:
        break;
    }
  }

  console.log(newAnswers, 'bla');

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
          <p className="indicator-description" style={{marginTop: '20px'}}>Descrição:</p>
          <p className="indicator-description" style={{marginBottom: '20px'}}>{indicator.question.description}</p>
          <div style={{marginBottom: '10px'}}>
            <span>Resposta:</span>
          </div>
          {
            typeAnswer(indicator.question.type)
          }
          <div style={{display: 'flex', marginTop: '10px'}}>
            <span>{indicator.point} / {indicator.weight}</span>
            <div className="btn-confirm btn-attach">Anexar arquivo</div>
            <SaveBtn save={() => saveAnswer(newAnswers, setSaving, point)} saving={saving} style={{fontSize: '16px'}}/>
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
  const [answersList, setAnswersList] = useState([]);
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
    setEvaluationId(data[0]._id);
    let answersList = {};
    let evaluation = data[0];
    if(evaluation.answers && evaluation.answers.length > 0) {
      for(let i = 0; i < evaluation.answers.length; i++) { //guarda as respostas pelo id de seu indicador
        answersList[evaluation.answers[i].indicatorId] = evaluation.answers[i];
      }
    }

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
          data3[k].point = pointIndicator;
        }
      }
      indicators[data2[j]._id] = data3; //guardar indicadores pelo id do critério para facilitar alterar o state
      data2[j].point = pointCriterion;
    }
    data1.maxProgress = maxProgress;
    setProgressGeneral(progressDimension);
    setDimension(data1);
    setCriteriaList(data2);
    setPointsGeneral(pointDimension);
    setIndicatorsList(indicators);
    setAnswersList(data[0].answers);
  }

  async function saveAnswer(answer, indicator, setSaving, pointIndicator, indexCriterion, indexInd) {
    let aux = answersList.slice();
    let newProgress = progressGeneral;
    let oldInd = aux.find(x => x.indicatorId === indicator._id);
    console.log(oldInd, 'oldind');
    if(answer.length > 0) { //se a resposta esta preenchida
      newProgress += 1;
      if(oldInd) { //se ja tem resposta do indicador somente altera ela
        oldInd.answer = answer;
      } else { //senão adiciona essa resposta, e altera o progresso
        aux.push({
          answer,
          indicatorId: indicator._id,
        })
      }
    } else { //se a resposta esta vazia
      newProgress -= 1;
      if(oldInd) { //se havia uma resposta do indicador deve-se retira-la, senão não acrescenta resposta
        let index = aux.findIndex(x => x.indicatorId === indicator._id);
        aux.splice(index, 1);
      }
    }

    setSaving(true);
    let body = {
      answers: aux,
      year: dimension.year,
    }
    if(evaluationId) {
      await updateEvaluationsUser(evaluationId, body);
    } else {
      let data = await saveEvaluationsUser(body);
      setEvaluationId(data._id);
    }
    setSaving(false);

    //atualizando a lista de todas as respostas
    setAnswersList(aux);

    setProgressGeneral(newProgress);

    //atualizando a pontuação da dimensão, substituindo a pontuação antiga do indicador pela nova
    let oldPoint = indicatorsList[indicator.criteriaId][indexInd].point;
    let newPoints = pointsGeneral - oldPoint + pointIndicator;
    setPointsGeneral(newPoints);

    //atualizando a pontuação do critério, substituindo a pontuação antiga do indicador pela nova
    let newCriteriaList = criteriaList.slice();
    newCriteriaList[indexCriterion].point += - oldPoint + pointIndicator;
    setCriteriaList(newCriteriaList);

    //atualizando pontuação do indicador
    let indicList = indicatorsList[indicator.criteriaId].slice();
    indicList[indexInd].point = pointIndicator;
    let newIndicatorList = {...indicatorsList};
    newIndicatorList[indicator.criteriaId] = indicList;
    setIndicatorsList(newIndicatorList)
  }
  console.log(indicatorsList, criteriaList, evaluationId, answersList);

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
              <span>{(progressGeneral * 100/dimension.maxProgress).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        {
          criteriaList.map((criterion, indexCriterion) => {
            return (
              <div key={indexCriterion}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span className="evaluation-title">{criterion.name}</span>
                  <span>{criterion.point}</span>
                </div>
                {
                  indicatorsList && indicatorsList[criterion._id].map((indicator, index) => (
                    <Indicator key={index} indicator={indicator} saveAnswer={(answer, setSaving, point) => saveAnswer(answer, indicator, setSaving, point, indexCriterion, index)}/>
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
