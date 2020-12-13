import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import {
  getEvaluationsUser, getAllDimensions, getAllCriteriaDimension, getAllIndicatorsCriterion, getAllYears
} from '../../services/requests';
import PuffLoader from 'react-spinners/PuffLoader';
import colors from '../../constants/colorsobject';

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

  useEffect(() => {
    getYearsList();
  }, []);

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

  async function getEvaluationInfo() {
    let data1 = await getAllDimensions({year: selectedYear});
    let data = await getEvaluationsUser(selectedYear);
    let answersList = {};
    let evaluation = data[0];
    if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
      for(let i = 0; i < evaluation.answers.length; i++) { //guarda as respostas pelo id de seu indicador
        answersList[evaluation.answers[i].indicatorId] = evaluation.answers[i];
      }
    }

    let pointsTotal = 0; //pontuação total
    let pointsTotalMax = 0; //pontuação total máxima

    for(let i = 0; i < data1.length; i++) {
      let data2 = await getAllCriteriaDimension(data1[i]._id);
      let pointDimension = 0; //pontuação da dimensão
      let pointDimensionMax = 0; //pontuação máxima da dimensão
      for(let j = 0; j < data2.length; j++) {
        let data3 = await getAllIndicatorsCriterion(data2[j].dimensionId, data2[j]._id);
        let pointCriterion = 0; //pontuação do critério
        let pointCriterionMax = 0; //pontuação máxima do critério
        if(evaluation && evaluation.answers && evaluation.answers.length > 0) {
          for(let k = 0; k < data3.length; k++) {
            let pointIndicator = 0; //pontuação do indicador
            let pointIndicatorMax = 0; //pontuação máxima do indicador
            let options = data3[k].question.options;
            for(let l = 0; l < options.length; l++) {
              pointIndicatorMax += options[l].points;
            }
            if(answersList[data3[k]._id]) { //se existe a resposta do indicador soma a pontuação da resposta, e o progresso na dimensão
              let answersIndicator = answersList[data3[k]._id].answer; //lista das respostas do indicador
              for(let l = 0; l < answersIndicator.length; l++) {
                let ind = answersList[data3[k]._id].answer[l].ansId; //indice da resposta dentro do vetor de opções de respostas do indicador
                pointIndicator += data3[k].weight * data3[k].question.options[ind].points;
              }
            }
            pointCriterion += pointIndicator;
            pointCriterionMax += pointIndicatorMax;
          }
          pointDimension += pointCriterion;
          pointDimensionMax += pointCriterionMax;
        }
        data2[j].point = pointCriterion;
        data2[j].pointMax = pointCriterionMax;
      }
      data1[i].point = pointDimension;
      data1[i].pointMax = pointDimensionMax;
      data1[i].criteriaList = data2;
      pointsTotal += pointDimension;
      pointsTotalMax += pointDimensionMax;
    }

    setDimensionsList(data1);
    setPointsGeneral(pointsTotal);
    setPointsGeneralTotal(pointsTotalMax);
    setLoading(false);
  }

  console.log(dimensionsList);

  function changeYear(value) {
    setSelectedYear(value);
    setLoading(true);
  }

  return (
    <BasePage
      title={'Relatório'}
    >
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
                      dimension.criteriaList.map((criterion, index) => (
                        <div style={{display: 'flex', margin: '5px 0px'}}>
                          <span>{criterion.name}</span>
                          <span style={{marginLeft: 'auto'}}>{criterion.point} / {criterion.pointMax}</span>
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
    </BasePage>
  )
}

export default Report;
