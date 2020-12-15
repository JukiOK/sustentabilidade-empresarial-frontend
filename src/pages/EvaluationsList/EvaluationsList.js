import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getEvaluationsList, getAllYears, getOrganizationsList } from '../../services/requests';
import ReactPaginate from 'react-paginate';
import { faSearch, faAngleLeft, faAngleRight, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

require('./evaluationsList.scss');

/**
* Componente para a tela de lista de avaliações
*/

function EvaluationsList(props) {

  const [evaluationsList, setEvaluationsList] = useState([]);
  const [selectPage, setSelectPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [yearSelected, setYearSelected] = useState();
  const [yearsList, setYearsList] = useState([]);
  const [orgSelected, setOrgSelected] = useState();
  const [orgList, setOrgList] = useState([]);

  useEffect(() => {
    getYears();
    getOrgList();
    getList();
  }, []);

  async function getYears() {
    let data = await getAllYears();
    setYearsList(data);
  }

  async function getOrgList() {
    let data = await getOrganizationsList();
    setOrgList(data.results);
  }

  async function getList(page) {
    let body = {
      page: page, pageSize: 10,
    }
    if(yearSelected) {
      body.year = yearSelected;
    }
    if(orgSelected) {
      body.orgId = orgSelected;
    }
    let data = await getEvaluationsList(body);
    setEvaluationsList(data.results);
    setTotal(Math.ceil(data.total/ data.pageSize)); //para calcular a quantidade de páginas
  }

  function filter() {
    getList();
  }

  return (
    <BasePage title={'Lista de avaliações'}>
      <div className="evaluations-list-container">
        <div className="evaluations-list-filters">
          <select value={yearSelected} onChange={e => setYearSelected(e.target.value)}>
            <option value="" >Selecionar ano</option>
            {
              yearsList.map((year, index) => (
                <option value={year.year}>{year.year}</option>
              ))
            }
          </select>
          <button className="btn-search" onClick={filter}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="table-cell">Organização</th>
              <th className="table-cell">Ano</th>
            </tr>
          </thead>
          <tbody>
            {
              evaluationsList.map((evaluation, index) => (
                <tr key={index} className="table-row" onClick={() => props.history.push('/testslist/' + evaluation.organization._id + '/' + evaluation._id + '/' + evaluation.year)}>
                  <td className="table-cell">{evaluation.organization && evaluation.organization.name}</td>
                  <td className="table-cell">{evaluation.year}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <ReactPaginate
          pageCount={total}
          forcePage={selectPage}
          pageRangeDisplayed={15}
          marginPagesDisplayed={2}
          onPageChange={(page) => getList(page.selected)}
          previousLabel={(<FontAwesomeIcon icon={faAngleLeft} className="icon-arrow"/>)}
          nextLabel={(<FontAwesomeIcon icon={faAngleRight} className="icon-arrow"/>)}
          containerClassName={'pagination-container'}
          activeLinkClassName={'active-page'}
          pageLinkClassName={'page-container'}
        />
      </div>
    </BasePage>
  )
}

export default EvaluationsList;
