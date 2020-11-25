import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

require('./dimensions.scss');

function Card(props) {
  return (
    <div className="card-container">
      <div className="card-row">
        <span className="card-title">{props.dimension}</span>
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
          <tr className="table-row">
            <td className="table-cell">
              <div>
                <span>missão engajamento</span>
                <span>peso</span>
              </div>
            </td>
            <td className="table-cell">
              <div className="indicator-cell">
                <span>compromisso social</span>
              </div>
              <div className="indicator-cell">
                <span>envolvimento parte</span>
              </div>
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-cell">
              <span>missão engajamento</span>
              <span>peso</span>
            </td>
            <td className="table-cell">
              <div>
                <span>compromisso social</span>
              </div>
              <div>
                <span>envolvimento parte</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function Dimensions(props) {

  const [filter, setFilter] = useState();
  useEffect(() => {
  }, []);


  return (
    <BasePage title={'Lista de dimensões'}>
      <div className="dimensions-container">
        <div className="dimensions-filter-container">
          <input />
          <div className="btn-confirm filter-btn"><FontAwesomeIcon icon={faSearch} /></div>
          <div className="btn-confirm new-btn" onClick={() => props.history.push('/dimensions/form/')}>Nova dimensão</div>
        </div>
        <Card dimension={'Governança'}/>
      </div>
    </BasePage>
  )
}

export default Dimensions;
