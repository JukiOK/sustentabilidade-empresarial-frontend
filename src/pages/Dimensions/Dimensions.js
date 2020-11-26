import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { saveDimension, getAllDimensions, getAllCriteriaDimension, getAllIndicatorsCriterion } from '../../services/requests';

require('./dimensions.scss');

function Card(props) {

  const [criteriaList, setCriteriaList] = useState();
  const [indicatorsList, setIndicatorsList] = useState();
  const { dimension } = props;

  useEffect(() => {
    getAll();
  }, []);

  async function getAll() {
    let data = await getAllCriteriaDimension(dimension._id);
    setCriteriaList(data);
    let aux = {};
    for(let i = 0; i < data.length; i++) {
      let indicators = await getAllIndicatorsCriterion(dimension._id, data[i]._id);
      aux[data[i]._id] = indicators;
    }

    setIndicatorsList(aux);
  }

  return (
    <div className="card-container" onClick={() => props.history.push('/dimensions/form/' + dimension._id)}>
      <div className="card-row">
        <span className="card-title">{dimension.name}</span>
        <FontAwesomeIcon icon={faEllipsisV} style={{fontSize: '24px'}}/>
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
                  <div>
                    <span>{criterion.name}</span>
                  </div>
                  <div>
                    <span>Peso na dimensão: {criterion.weight}</span>
                  </div>
                </td>
                <td className="table-cell">
                  {
                    indicatorsList && indicatorsList[criterion._id].map((indicator, index) => (
                      <div className="indicator-cell">
                        <span>{indicator.name}</span>
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

function Dimensions(props) {

  const [filter, setFilter] = useState();
  const [dimensionsList, setDimensionsList] = useState();

  useEffect(() => {
    getInfos();
  }, []);

  async function getInfos() {
    let data = await getAllDimensions();
    setDimensionsList(data);
  }

  async function newDimension() {
    let data = await saveDimension();
    props.history.push('/dimensions/form/' + data._id);
  }

  return (
    <BasePage title={'Lista de dimensões'}>
      <div className="dimensions-container">
        <div className="dimensions-filter-container">
          <input />
          <div className="btn-confirm filter-btn"><FontAwesomeIcon icon={faSearch} /></div>
          <div className="btn-confirm new-btn" onClick={newDimension}>Nova dimensão</div>
        </div>
        {
          dimensionsList && dimensionsList.map((dimension, index) => (
            <Card dimension={dimension} key={index} history={props.history}/>
          ))
        }
      </div>
    </BasePage>
  )
}

export default Dimensions;
