import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import {
  getAllYears,
  getEvaluationsUser,
  getAllDimensions,
  getAllCriteriaDimension,
  getAllIndicatorsCriterion,
  getEvaluationOrgById,
  validateEvaluation,
  invalidateEvaluation,
  finishEvaluation,
} from '../../services/requests';
import PuffLoader from 'react-spinners/PuffLoader';
import colors from '../../constants/colorsobject';
import { useDispatch, useSelector } from 'react-redux';
import { setYearEvaluation } from '../../redux/actions/evaluationAction';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

require('./evaluation.scss');

/**
* Componente para página de Avaliação.
*/

function Evaluation(props) {

  const [yearsList, setYearsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [dimensionsList, setDimensionsList] = useState([]);
  const [pointsGeneral, setPointsGeneral] = useState(0);
  const [progressGeneral, setProgressGeneral] = useState(0);
  const [evaluation, setEvaluation] = useState();
  const [loading, setLoading] = useState(true);
  const img = require('../../assets/images/quadro_geral.png');
  const dispatch = useDispatch();
  const yearSaved = useSelector(state => state.evaluation && state.evaluation.year);
  const org = useSelector(state => state.organization && state.organization.mineOrg);
  const params = useParams();

  useEffect(() => {
    if(params.orgId) { //se é a tela de validação da avaliação
      setSelectedYear(params.year);
    } else { //se é a tela da avaliação do usuário
      if(org) { //se tem usuário tem organização
        setLoading(true);
        getYearsList();
      } else {
        setLoading(false);
      }
    }
  }, [org]);

  useEffect(() => {
    if(selectedYear) {
      getEvaluationInfo();
    }
  }, [selectedYear]);

  async function getYearsList() {
    let data = await getAllYears();
    setYearsList(data);
    if(data.length > 0) {
      if(yearSaved) { //se o ano esta salvo no redux
        setSelectedYear(yearSaved);
      } else {
        setSelectedYear(data[data.length-1].year);
        dispatch(setYearEvaluation(data[data.length-1].year));
      }
    }
  }

  async function getEvaluationInfo() {
    let data;
    let evaluation;
    if(params.orgId) { //se é a tela de validação da avaliação
      data = await getEvaluationOrgById(params.orgId, params.evaluationId);
      evaluation = data;
    } else {
      data = await getEvaluationsUser(selectedYear);
      evaluation = data[0];
    }
    let answersList = {};
    if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
      for(let i = 0; i < evaluation.answers.length; i++) { //guarda as respostas pelo id de seu indicador
        answersList[evaluation.answers[i].indicatorId] = evaluation.answers[i];
      }
    }
    setEvaluation(evaluation);
    // console.log(answersList, evaluation);
    let data1 = await getAllDimensions({year: selectedYear});
    setDimensionsList(data1);
    setLoading(false);
    let pointsTotal = 0; //pontuação total da avaliação
    let progressAll = 0; //progresso total da avaliação

    for(let i = 0; i < data1.length; i++) {
      getAllCriteriaDimension(data1[i]._id).then(data2 => {
        setDimensionsList(oldDimList => {
          let newDimList = [...oldDimList];
          newDimList[i].criteriaList = data2;
          return newDimList;
        });
        data1[i].criteriaList = data2;
        let maxProgress = 0; //progresso total da dimensão
        let pointDimension = 0; //pontuação da dimensão
        let progressDimension = 0; //progresso da dimensão
        for(let j = 0; j < data2.length; j++) {
          getAllIndicatorsCriterion(data2[j].dimensionId, data2[j]._id).then(data3 => {
            maxProgress += data3.length; //progresso maximo da dimensão será a quantidade total de indicadores
            setProgressGeneral(oldProgress => oldProgress + data3.length);

            setDimensionsList(oldDimList => {
              let newDimList = [...oldDimList];
              newDimList[i].progressTotal = maxProgress;
              return newDimList;
            });
            if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
              for(let k = 0; k < data3.length; k++) {
                if(answersList[data3[k]._id]) { //se existe a resposta do indicador soma a pontuação das respostas, e o progresso na dimensão
                  let answersIndicator = answersList[data3[k]._id].answer;
                  for(let l = 0; l < answersIndicator.length; l++) { //somar pontuação das respostas
                    let ind = answersIndicator[l].ansId;
                    pointDimension += data3[k].weight * data3[k].question.options[ind].points * data2[j].weight;
                    setDimensionsList(oldDimList => {
                      let newDimList = [...oldDimList];
                      newDimList[i].pointDimension = pointDimension;
                      return newDimList;
                    });
                    setPointsGeneral(oldPoints => oldPoints + data3[k].weight * data3[k].question.options[ind].points * data2[j].weight);
                  }
                  progressDimension += 1; //quantidade de indicadores respondidos


                  setDimensionsList(oldDimList => {
                    let newDimList = [...oldDimList];
                    newDimList[i].progressDimension = progressDimension;
                    return newDimList;
                  });
                  // console.log(pointDimension);
                }
              }
            }
          });
        }
        // data1[i].progressTotal = maxProgress;
        // data1[i].progressDimension = progressDimension;
        // data1[i].pointDimension = pointDimension;
        // progressAll += maxProgress;
        // pointsTotal += pointDimension;
      });
    }
    // if(evaluation && evaluation.answers) {
    //   setProgressGeneral((evaluation.answers.length * 100/progressAll).toFixed(2));
    // } else {
    //   setProgressGeneral(0);
    // }
    // setPointsGeneral(pointsTotal);
  }

  function changeYear(value) {
    setSelectedYear(value);
    dispatch(setYearEvaluation(value));
    setLoading(true);
    setPointsGeneral(0);
    setProgressGeneral(0);
  }

  // console.log(dimensionsList);
  function handleClickDimension(id) {
    if(params.orgId) {
      props.history.push('/testslist/form/' + id + '/' + params.orgId + '/' + params.evaluationId);
    } else {
      props.history.push('/evaluation/form/' + id)
    }
  }

  async function handleValidate() {
    let data;
    if(!evaluation.validated) {
      data = await validateEvaluation(params.orgId, params.evaluationId);
    } else {
      data = await invalidateEvaluation(params.orgId, params.evaluationId);
    }
    setEvaluation(data);
  }

  async function handleFinishEval() {
    let data = await finishEvaluation(evaluation._id);
    setEvaluation(data);
  }

  return (
    <BasePage
      title={'Avaliação'}
      backBtn={props.backBtn}
    >
      {
        (org || params.orgId) ?
        <div className="evaluation-container">
          <span className="evaluation-title">Quadro Geral</span>
          {
            params.orgId ?
            <div>
              <span>Avaliação do ano {params.year}</span>
            </div>
            :
            <div>
              <span>Selecione o ano da avaliação:</span>
              <select value={selectedYear} onChange={e => changeYear(e.target.value)} style={{marginLeft: '10px'}}>
                {
                  yearsList.map((year, index) => (
                    <option key={index} value={year.year}>{year.year}</option>
                  ))
                }
              </select>
            </div>
          }
          {
            !loading ?
            <div>
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
                    {
                      evaluation ?
                      <span>{(evaluation.answers.length * 100/progressGeneral).toFixed(2)}%</span>
                      :
                      <span>-%</span>
                    }
                  </div>
                </div>
                {
                  params.orgId ?
                  <div className="evaluation-container-info">
                    <span>Avaliação {evaluation.validated ? 'válida' : 'inválida'}</span>
                    <div className="btn-confirm" onClick={handleValidate}>{evaluation.validated ? 'Invalidar' : 'Validar'}</div>
                  </div>
                  : evaluation &&
                  <div className="evaluation-container-info">
                    <button className="btn-confirm" disabled={evaluation.finished || (evaluation.answers.length !== progressGeneral)} onClick={handleFinishEval}>
                      {evaluation.finished ? 'Finalizada' : 'Finalizar avaliação'}
                    </button>
                  </div>
                }
              </div>
              <span className="evaluation-title">Dimensões</span>
              {
                dimensionsList.map((dimension, indexDimension) => (
                  <div className="dimension-card" key={indexDimension}>
                    <div>
                      <p className="dimension-name">{dimension.name}</p>
                      {
                        dimension.criteriaList &&
                        dimension.criteriaList.map((criterion, index) => (
                          <p key={index}>{criterion.name}</p>
                        ))
                      }
                    </div>
                    <div className="dimension-progress">
                      <div>
                        <span>Pontuação </span>
                        <span>{dimension.pointDimension ? dimension.pointDimension : 0}</span>
                      </div>
                      <div>
                        <span>Progresso </span>
                        <span>{dimension.progressDimension ? dimension.progressDimension : 0}/{dimension.progressTotal}</span>
                      </div>
                      <div className="btn-confirm" onClick={() => handleClickDimension(dimension._id)}>{(params.orgId || (evaluation && evaluation.finished)) ? 'Ver' : 'Começar'}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            :
            <div className="loader-container">
              <PuffLoader loading={loading} size={100} color={colors.black}/>
            </div>
          }
        </div>
        :
        <div style={{padding: '20px'}}>
          <span>Você não tem uma organização. Por favor crie uma para ter acesso as avaliações.</span>
        </div>
      }
    </BasePage>
  )
}

export default Evaluation;

Evaluation.propTypes = {
  /**
  * history do router-dom
  */
  history: PropTypes.object,
  /**
  * Se tem botão de voltar
  */
  backBtn: PropTypes.bool,
}
