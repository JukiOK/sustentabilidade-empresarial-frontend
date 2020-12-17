import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import {
  getEvaluationsUser, getAllDimensions, getAllCriteriaDimension, getAllIndicatorsCriterion, getAllYears
} from '../../services/requests';
import PuffLoader from 'react-spinners/PuffLoader';
import colors from '../../constants/colorsobject';
import { useSelector } from 'react-redux';

require('./report.scss');

/**
* Componente para página de relatório.
*/

function Report(props) {

  const [dimensionsList, setDimensionsList] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [pointsGeneral, setPointsGeneral] = useState(0);
  const [pointsGeneralTotal, setPointsGeneralTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState();
  const org = useSelector(state => state.organization && state.organization.mineOrg);

  useEffect(() => {
    if(org) {
      getYearsList();
    }
  }, [org]);

  useEffect(() => {
    if(selectedYear) {
      getEvaluationInfo();
    }
  }, [selectedYear])

  async function getYearsList() {
    let data = await getAllYears();
    setYearsList(data);
    if(data.length > 0) {
      setSelectedYear(data[data.length-1].year);
    }
  }

  function updateDimensionList(index, obj, value){
    setDimensionsList(oldDimList => {
      let newDimList = [...oldDimList];
      newDimList[index][obj] = value;
      return newDimList;
    })
  }

  async function getEvaluationInfo() {
    let data1 = await getAllDimensions({year: selectedYear});
    setDimensionsList(data1);
    setLoading(false);
    let data = await getEvaluationsUser(selectedYear);
    let answersList = {};
    let evaluation = data[0];
    setEvaluation(evaluation);
    if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
      for(let i = 0; i < evaluation.answers.length; i++) { //guarda as respostas pelo id de seu indicador
        answersList[evaluation.answers[i].indicatorId] = evaluation.answers[i];
      }
    }

    for(let i = 0; i < data1.length; i++) {
      data1[i].point = 0;
      data1[i].pointMax = 0;
      getAllCriteriaDimension(data1[i]._id).then(data2 => {
        updateDimensionList(i, 'criteriaList', data2);
        for(let j = 0; j < data2.length; j++) {
          data2[j].point = 0;
          data2[j].pointMax = 0;
          getAllIndicatorsCriterion(data2[j].dimensionId, data2[j]._id).then(data3 => {
            for(let k = 0; k < data3.length; k++) {
              let options = data3[k].question.options;
              for(let l = 0; l < options.length; l++) {
                let points = options[l].points;
                data2[j].pointMax += points;
                data1[i].pointMax += points;
                setPointsGeneralTotal(oldPoitsTotal => oldPoitsTotal + points);
                updateDimensionList(i, 'criteriaList', data2);
                updateDimensionList(i, 'pointMax', data1[i].pointMax);
              }
              if(answersList[data3[k]._id]) { //se existe a resposta do indicador soma a pontuação da resposta, e o progresso na dimensão
                let answersIndicator = answersList[data3[k]._id].answer; //lista das respostas do indicador
                for(let l = 0; l < answersIndicator.length; l++) {
                  let ind = answersList[data3[k]._id].answer[l].ansId; //indice da resposta dentro do vetor de opções de respostas do indicador
                  let points = data3[k].weight * data3[k].question.options[ind].points;
                  data2[j].point += points;
                  data1[i].point += points;
                  setPointsGeneral(oldPoints => oldPoints + points);
                  updateDimensionList(i, 'criteriaList', data2);
                  updateDimensionList(i, 'point', data1[i].point);
                }
              }
            }
          });
        }
      });
    }
  }

  console.log(dimensionsList);

  function changeYear(value) {
    setSelectedYear(value);
    setLoading(true);
    setPointsGeneralTotal(0);
    setPointsGeneral(0);
  }

  return (
    <BasePage
      title={'Relatório'}
    >
      {
        org ?
        <div className="report-container">
          <div>
            <span>Selecione o ano:</span>
            <select value={selectedYear} onChange={(e) => changeYear(e.target.value)} style={{marginLeft: '10px'}}>
              {
                yearsList.map((year, index) => (
                  <option value={year.year} key={index}>{year.year}</option>
                ))
              }
            </select>
          </div>
          {
            !loading ?
            <div>
              <span className="report-title">Pontuação geral</span>
              <div className="report-container-general">
                <div className="report-container-info">
                  {/* <span>Pontuação não atingiu o mínimo para o certificado.</span>
                    <span>Saiba mais</span> */}
                  </div>
                  <div className="report-circular" style={{borderColor: pointsGeneral === pointsGeneralTotal ? colors.brightgreen : colors.red}}>
                    <span style={{fontSize: '30px'}}>{pointsGeneral} / {pointsGeneralTotal}</span>
                  </div>
                  {
                    evaluation &&
                    <div style={{marginLeft: '20px'}}>
                      <span>Status da avaliação:</span>
                      <span>{evaluation.validated ? ' Válida' : ' Inválida'}</span>
                    </div>
                  }
                </div>
                <span className="report-title">Pontuação por dimensão</span>
                <div className="row">
                  {
                    dimensionsList.map((dimension, indexDimension) => (
                      <div className="dimension-card" key={indexDimension}>
                        <p className="dimension-name">{dimension.name}</p>
                        <div className="report-circular small-circle" style={{borderColor: dimension.point === dimension.pointMax ? colors.brightgreen : colors.red}}>
                          <span>{dimension.point} / {dimension.pointMax}</span>
                        </div>
                        {
                          dimension.criteriaList &&
                          dimension.criteriaList.map((criterion, index) => (
                            <div style={{display: 'flex', margin: '5px 0px'}}>
                              <span>{criterion.name}</span>
                              <span style={{marginLeft: 'auto'}}>{criterion.point ? criterion.point : 0} / {criterion.pointMax ? criterion.pointMax : 0}</span>
                            </div>
                          ))
                        }
                        <span>Saiba como melhorar</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            :
            <div className="loader-container">
              <PuffLoader loading={loading} size={100} color={colors.black}/>
            </div>
          }
        </div>
        :
        <div style={{padding: '20px'}}>
          <span>Você não tem uma organização. Por favor crie uma para ter acesso ao relatório.</span>
        </div>
      }
    </BasePage>
  )
}

export default Report;
