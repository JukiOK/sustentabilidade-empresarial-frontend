import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import {
  getAllYears,
  addYear,
  deleteYear,
  saveDimension,
  getAllDimensions,
  getAllCriteriaDimension,
  getAllIndicatorsCriterion,
  deleteDimension } from '../../services/requests';
import Overlay from '../../components/Overlay/Overlay';

require('./dimensions.scss');

/**
* Componente para o card envolvendo a dimensão.
*/
export function Card(props) {

  const [criteriaList, setCriteriaList] = useState();
  const [indicatorsList, setIndicatorsList] = useState();
  const [openOverlay, setOpenOverlay] = useState(false);
  const [expand, setExpand] = useState(false);

  const { dimension, history, deleteDimensionId } = props;

  useEffect(() => {
    getAll();
  }, []);

  async function getAll() {
    let data = await getAllCriteriaDimension(dimension._id);
    setCriteriaList(data);
    let aux = {};
    //indexar lista de indicadores pelo id do critério deles
    for(let i = 0; i < data.length; i++) {
      let indicators = await getAllIndicatorsCriterion(dimension._id, data[i]._id);
      aux[data[i]._id] = indicators;
    }

    setIndicatorsList(aux);
  }

  function handleClickDelete() {
    setOpenOverlay(false);
    deleteDimensionId(dimension._id);
  }

  return (
    <div className="card-container">
      <Overlay openOverlay={openOverlay} setOpenOverlay={(value) => setOpenOverlay(value)}>
        <span>Tem certeza que deseja apagar a dimensão? Essa ação não pode ser desfeita.</span>
        <div className="btn-row">
          <div className="btn-confirm yes-btn" onClick={handleClickDelete}>Sim</div>
          <div className="btn-confirm cancel-btn" onClick={() => setOpenOverlay(false)}>Não</div>
        </div>
      </Overlay>
      <div className="card-row">
        <span className="card-title">{dimension.name}</span>
        <FontAwesomeIcon icon={faEdit} className="icon-edit" onClick={() => history.push('/dimensions/form/' + dimension._id)}/>
        <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={() => setOpenOverlay(true)}/>
        <FontAwesomeIcon icon={expand ? faAngleUp : faAngleDown} className="icon-arrow" onClick={() => setExpand(!expand)} />
      </div>
      {
        expand &&
        <table className="table-dimension">
          <thead>
            <tr>
              <th className="table-cell">Critérios</th>
              <th className="table-cell">Indicadores</th>
            </tr>
          </thead>
          <tbody>
            {
              criteriaList && criteriaList.map((criterion, index) => (
                <tr className="table-row" key={index}>
                  <td className="table-cell">
                    <div style={{margin: '10px'}}>
                      <span>{criterion.name}</span>
                    </div>
                    <div style={{margin: '10px'}}>
                      <span>Peso na dimensão: {criterion.weight}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {
                      indicatorsList && indicatorsList[criterion._id].map((indicator, index) => (
                        <div className="indicator-cell">
                          <span>{indicator.name}</span>
                          <span style={{marginLeft: 'auto'}}>{indicator.weight}</span>
                        </div>
                      ))
                    }
                  </td>
                </tr>
              ))
            }

          </tbody>
        </table>
      }

    </div>
  )
}

/**
* Componente para a página da Lista de dimensões.
*/

function Dimensions(props) {

  const [filter, setFilter] = useState();
  const [yearsList, setYearsList] = useState();
  const [yearInput, setYearInput] = useState('');
  const [openOverlay, setOpenOverlay] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [indYear, setIndYear] = useState('');

  useEffect(() => {
    setTimeout(() => {getInfos();}, 300); //delay para garantir que a dimensão não editada foi excluida do banco de dados
  }, []);

  async function getInfos() {
    let data1 = await getAllYears();
    //Adicionar lista de dimensões ao seu ano
    for(let i = 0; i < data1.length; i++) {
      let data = await getAllDimensions({year: data1[i].year});
      data1[i].dimensionsList = data;
    }
    setYearsList(data1);
  }

  async function newDimension(year) {
    let data = await saveDimension({year: year});
    props.history.push('/dimensions/form/' + data._id);
  }

  async function deleteDimensionId(id, idArray, indexYear) {
    //remover dimensão, com id da dimensão, indice da dimensõo no vetor yearsList e indice do ano no vetor
    await deleteDimension(id);
    let aux = yearsList.slice();
    aux[indexYear].dimensionsList.splice(idArray, 1);
    setYearsList(aux);
  }

  async function newYear() {
    if(yearInput) {
      let data = await addYear({year: yearInput});
      let aux = yearsList.slice();
      let ind;
      //colocar ano na lista ordenada
      if(yearInput < aux[0].year) {
        ind = 0;
      } else if (yearInput >= aux[aux.length - 1].year) {
        ind = aux.length;
      } else {
        for(let i = 1; i < aux.length; i++) {
          if(aux[i - 1].year < yearInput && aux[i].year >= yearInput) {
            ind = i;
            break;
          }
        }
      }
      aux.splice(ind, 0, data);
      setYearsList(aux);
    }
  }

  async function removeYear() {
    //remover ano, com id do ano e indice do ano no vetor
    await deleteYear(selectedYear._id);
    let aux = yearsList.slice();
    aux.splice(indYear, 1);
    setYearsList(aux);
    setOpenOverlay(false);
  }

  function handleClickDelete(index) {
    setOpenOverlay(true);
    setIndYear(index);
    setSelectedYear(yearsList[index]);
  }

  // console.log(yearsList);

  return (
    <BasePage title={'Versões da avaliação'}>
      <div className="dimensions-container">
        <Overlay openOverlay={openOverlay} setOpenOverlay={(value) => setOpenOverlay(value)} >
          <div>
            <span>Tem certeza que deseja apagar o ano {selectedYear.year}? Essa ação não pode ser desfeita.</span>
            <div className="btn-row">
              <div className="btn-confirm yes-btn" onClick={() => removeYear()}>Sim</div>
              <div className="btn-confirm cancel-btn" onClick={() => setOpenOverlay(false)}>Não</div>
            </div>
          </div>
        </Overlay>
        <div className="dimensions-filter-container">
          <input type="number" placeholder="Adicionar ano" value={yearInput} onChange={e => setYearInput(e.target.value)} />
          <div className="btn-confirm add-btn" onClick={newYear}>
            <FontAwesomeIcon icon={faPlus} className="icon-btn"/>
          </div>
        </div>
        <hr/>
        {
          yearsList && yearsList.map((year, indexYear) => {
            return (
            <div>
              <div className="dimensions-filter-container">
                <span style={{fontWeight: 'bold', fontSize: '25px'}}>{year.year}</span>
                <div className="btn-confirm new-btn" onClick={() => newDimension(year.year)}>Nova dimensão</div>
                <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={() => handleClickDelete(indexYear)}/>
              </div>
              {
                year.dimensionsList && year.dimensionsList.map((dimension, index) => (
                  <Card dimension={dimension} key={index} history={props.history} deleteDimensionId={(id) => deleteDimensionId(id, index, indexYear)}/>
                ))
              }
              <hr/>
            </div>
            )
          })
        }
      </div>
    </BasePage>
  )
}

export default Dimensions;
