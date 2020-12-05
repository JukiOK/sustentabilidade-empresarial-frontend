import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { saveDimension, getAllDimensions, getAllCriteriaDimension, getAllIndicatorsCriterion, deleteDimension } from '../../services/requests';
import Overlay from '../../components/Overlay/Overlay';

require('./dimensions.scss');

/**
* Componente para o card envolvendo a dimensão.
*/
function Card(props) {

  const [criteriaList, setCriteriaList] = useState();
  const [indicatorsList, setIndicatorsList] = useState();
  const [openOverlay, setOpenOverlay] = useState(false);

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
      </div>
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
    </div>
  )
}

/**
* Componente para a página da Lista de dimensões.
*/

function Dimensions(props) {

  const [filter, setFilter] = useState();
  const [dimensionsList, setDimensionsList] = useState();

  useEffect(() => {
    setTimeout(() => {getInfos();}, 300); //delay para garantir que a dimensão não editada foi excluida do banco de dados
  }, []);

  async function getInfos() {
    let data = await getAllDimensions();
    setDimensionsList(data);
  }

  async function newDimension() {
    let data = await saveDimension();
    props.history.push('/dimensions/form/' + data._id);
  }

  async function deleteDimensionId(id, idArray) {
    await deleteDimension(id);
    let aux = dimensionsList.slice();
    aux.splice(idArray, 1);
    setDimensionsList(aux);
  }

  console.log(dimensionsList);

  return (
    <BasePage title={'Lista de dimensões'}>
      <div className="dimensions-container">
        <div className="dimensions-filter-container">
          <div className="btn-confirm new-btn" onClick={newDimension}>Nova dimensão</div>
        </div>
        {
          dimensionsList && dimensionsList.map((dimension, index) => (
            <Card dimension={dimension} key={index} history={props.history} deleteDimensionId={(id) => deleteDimensionId(id, index)}/>
          ))
        }
      </div>
    </BasePage>
  )
}

export default Dimensions;
