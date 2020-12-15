import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { faTrashAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import SaveBtn from '../../components/SaveBtn/SaveBtn';
import PuffLoader from 'react-spinners/PuffLoader';
import {
  getEvaluationsUser, getDimension,
  getAllCriteriaDimension, getAllIndicatorsCriterion,
  updateEvaluationsUser, saveEvaluationsUser, getEvaluationOrgById
} from '../../services/requests';
import colors from '../../constants/colorsobject';
import PropTypes from 'prop-types';

require('./formEvaluation.scss');

/**
* Componente para card do indicador.
*/

export function Indicator(props) {
  const { indicator, saveAnswer, isFromOrg } = props;
  const [expand, setExpand] = useState(false);
  const [newAnswers, setNewAnswers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [point, setPoint] = useState(indicator.point);
  const [linkEvidence, setLinkEvidence] = useState(indicator.evidenceLink);

  useEffect(() => {
    if(indicator.answer) {
      setNewAnswers(indicator.answer);
    }
  }, []);

  function handleChangeAnswer(value, type) {
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
          <input style={{width: '100%'}} value={newAnswers && newAnswers[0] && newAnswers[0].text} onChange={e => handleChangeAnswer(e.target.value, 'dissertative')} disabled={isFromOrg}/>
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
                    disabled={isFromOrg}
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
                    disabled={isFromOrg}
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

  // console.log(newAnswers, 'bla');

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
          {
            indicator.description &&
            <div>
              <p className="indicator-description" style={{marginTop: '20px'}}>Descrição:</p>
              <p className="indicator-description" style={{marginBottom: '20px'}}>{indicator.description}</p>
            </div>
          }
          <div style={{marginBottom: '10px'}}>
            <span>Resposta:</span>
          </div>
          {
            typeAnswer(indicator.question.type)
          }
          <div className="row-buttons" >
            <span className="points-text">Pontos: {indicator.point} / {indicator.maxPoints}</span>
            {
              indicator.evidence &&
              <input className="evidence-input" placeholder="Link para arquivo com todas evidências" value={linkEvidence} onChange={(e) => setLinkEvidence(e.target.value)} disabled={isFromOrg}/>
            }
            <SaveBtn save={() => saveAnswer(newAnswers, setSaving, point, linkEvidence)} saving={saving} style={{fontSize: '16px'}} classBtn="save-eval" disabled={isFromOrg}/>
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
  const [criteriaList, setCriteriaList] = useState();
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
    data1.maxProgress = 0;
    setDimension(data1);
    let data;
    let evaluation;
    if(params.orgId) { //se esta na tela da avaliação de uma organização
      data = await getEvaluationOrgById(params.orgId, params.evaluationId);
      if(data) {
        setEvaluationId(data._id);
        setAnswersList(data.answers);
      }
      evaluation = data;
    } else {
      data = await getEvaluationsUser(data1.year);
      if(data.length > 0) { //se tem uma avaliação salva
        setEvaluationId(data[0]._id);
        setAnswersList(data[0].answers);
      }
      evaluation = data[0];
    }
    let answersList = {};
    if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
      for(let i = 0; i < evaluation.answers.length; i++) { //guarda as respostas pelo id de seu indicador
        answersList[evaluation.answers[i].indicatorId] = evaluation.answers[i];
      }
    }

    let data2 = await getAllCriteriaDimension(data1._id);
    setCriteriaList(data2);
    let maxProgress = 0; //progresso total da dimensão
    let pointDimension = 0; //pontuação da dimensão
    let progressDimension = 0; //progresso da dimensão
    setIndicatorsList({});
    for(let j = 0; j < data2.length; j++) {
      setIndicatorsList(old => {
        let newInd = {...old};
        newInd[data2[j]._id] = [];
        return newInd;
      });
      getAllIndicatorsCriterion(data2[j].dimensionId, data2[j]._id).then(data3 => {
        let pointCriterion = 0; //pontuação do critério
        setDimension(oldDim => {
          let newDim = {...oldDim};
          newDim.maxProgress += data3.length;
          return newDim;
        })
        for(let k = 0; k < data3.length; k++) {
          let pointIndicator = 0; //pontuação do indicador
          let pointIndicatorMax = 0;
          let options = data3[k].question.options;
          for(let l = 0; l < options.length; l++) { //calcular pontuação máxima do indicador
            pointIndicatorMax += options[l].points;
          }
          data3[k].maxPoints = pointIndicatorMax * data3[k].weight;
          if(answersList[data3[k]._id]) { //se existe a resposta do indicador soma a pontuação da resposta, e o progresso na dimensão
            let answersIndicator = answersList[data3[k]._id].answer; //lista das respostas do indicador
            for(let l = 0; l < answersIndicator.length; l++) {
              let ind = answersList[data3[k]._id].answer[l].ansId; //indice da resposta dentro do vetor de opções de respostas do indicador
              pointIndicator += data3[k].weight * data3[k].question.options[ind].points;
              setPointsGeneral(old => old + data3[k].weight * data3[k].question.options[ind].points);
            }
            setProgressGeneral(old => old + 1);
            data3[k].answer = answersList[data3[k]._id].answer; //guardar vetor de respostas no indicador
            data3[k].evidenceLink = answersList[data3[k]._id].evidence; //guardar link da evidência
          }
          data3[k].point = pointIndicator;
          pointCriterion += pointIndicator;
          setIndicatorsList(old => {
            let newInd = {...old};
            newInd[data2[j]._id][k] = data3[k];
            return newInd;
          });
        }

        //guardar indicadores pelo id do critério para facilitar alterar o state
        data2[j].point = pointCriterion;
        setCriteriaList([...data2]);
      });
    }
    // data1.maxProgress = maxProgress;
    // setIndicatorsList(indicators);
  }

  async function saveAnswer(answer, indicator, setSaving, pointIndicator, indexCriterion, indexInd, linkEvidence) {
    let aux = answersList.slice();
    let newProgress = progressGeneral;
    let oldInd = aux.find(x => x.indicatorId === indicator._id);
    if(answer.length > 0) { //se a resposta esta preenchida
      newProgress += 1;
      if(oldInd) { //se ja tem resposta do indicador somente altera ela
        oldInd.answer = answer;
        oldInd.evidence = linkEvidence;
      } else { //senão adiciona essa resposta, e altera o progresso
        aux.push({
          answer,
          indicatorId: indicator._id,
          evidence: linkEvidence,
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
    <BasePage title={dimension.name} backBtn={props.backBtn}>
      {
        criteriaList ?
        <div>
          <div className="form-evaluation-container">
            <span className="evaluation-title">Quadro Geral</span>
            <div className="evaluation-container-general">
              <img src={img} className="img"/>
              <div className="evaluation-container-texts">
                <div style={{display: 'flex'}}>
                  <div className="evaluation-container-info" style={{marginLeft: '0px'}}>
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
                <div className="description-container">
                  <span>Descrição: {dimension.description}</span>
                </div>
              </div>
            </div>
            {
              criteriaList.map((criterion, indexCriterion) => {
                return (
                  <div key={indexCriterion} className="criterion-container">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span className="evaluation-title">{criterion.name}</span>
                      <span className="points-text">Pontuação: {criterion.point}</span>
                    </div>
                    {
                      indicatorsList &&
                      indicatorsList[criterion._id] &&
                      indicatorsList[criterion._id].map((indicator, index) => (
                        <Indicator key={index} indicator={indicator}
                          saveAnswer={(answer, setSaving, point, linkEvidence) => saveAnswer(answer, indicator, setSaving, point, indexCriterion, index, linkEvidence)}
                          isFromOrg={params.orgId ? true : false}
                        />
                      ))
                    }

                  </div>
                )
              })
            }

          </div>
        </div>
        :
        <div className="loader-container">
          <PuffLoader loading={criteriaList} size={100} color={colors.black}/>
        </div>
      }

    </BasePage>
  )
}

export default FormEvaluation;

FormEvaluation.propTypes = {
  /**
  * history do router-dom
  */
  history: PropTypes.object,
  /**
  * Se tem botão de voltar
  */
  backBtn: PropTypes.bool,
}

Indicator.propTypes = {
  /**
  * Objeto do indicador
  */
  indicator: PropTypes.object.isRequired,
  /**
  * Salvar resposta do indicador
  */
  saveAnswer: PropTypes.func.isRequired,
  /**
  * Indicar se é tela para avaliação de uma organização
  */
  isFromOrg: PropTypes.bool.isRequired,
}
