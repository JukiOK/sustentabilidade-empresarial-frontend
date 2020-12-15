import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getEvaluationsList, getAllYears, getOrganizationsList } from '../../services/requests';
import ReactPaginate from 'react-paginate';
import { faSearch, faAngleLeft, faAngleRight, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Overlay from '../../components/Overlay/Overlay';
import Organizations from '../../components/Organizations/Organizations';

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
  const [open, setOpen] = useState(false);
  const [selectOrg, setSelectOrg] = useState('');

  useEffect(() => {
    getYears();
    getList();
  }, []);

  async function getYears() {
    let data = await getAllYears();
    setYearsList(data);
  }

  async function getList(page) {
    let body = {
      page: page, pageSize: 10,
    }
    if(yearSelected) {
      body.year = yearSelected;
    }
    if(selectOrg) {
      body.orgId = selectOrg._id;
    }
    let data = await getEvaluationsList(body);
    setEvaluationsList(data.results);
    setTotal(Math.ceil(data.total/ data.pageSize)); //para calcular a quantidade de páginas
  }

  function handleSelectOrg(value) {
    setSelectOrg(value);
    setOpen(false);
  }

  function cleanFilters() {
    setSelectOrg('');
    setYearSelected('');
  }

  return (
    <BasePage title={'Lista de avaliações'}>
      <Overlay openOverlay={open} setOpenOverlay={(value) => setOpen(value)}>
        <Organizations isFilter setOrg={(value) => handleSelectOrg(value)}/>
      </Overlay>
      <div className="evaluations-list-container">
        <div className="evaluations-list-filters">
          <div className="filter-org" onClick={() => setOpen(true)}>
            {selectOrg ? selectOrg.name : 'Selecione uma organização'}
          </div>
          <select value={yearSelected} onChange={e => setYearSelected(e.target.value)} >
            <option value="" >Selecionar ano</option>
            {
              yearsList.map((year, index) => (
                <option value={year.year}>{year.year}</option>
              ))
            }
          </select>
          <button className="btn-search" onClick={() => getList(0)}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faTimesCircle} className="btn-clean" onClick={cleanFilters}/>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="table-cell">Organização</th>
              <th className="table-cell">Ano</th>
              <th className="table-cell">Validado?</th>
            </tr>
          </thead>
          <tbody>
            {
              evaluationsList.map((evaluation, index) => (
                <tr key={index} className="table-row" onClick={() => props.history.push('/testslist/' + evaluation.organization._id + '/' + evaluation._id + '/' + evaluation.year)}>
                  <td className="table-cell">{evaluation.organization && evaluation.organization.name}</td>
                  <td className="table-cell">{evaluation.year}</td>
                  <td className="table-cell" style={{width: '30px'}}>
                    <div className="validated-cell">
                      {
                        evaluation.validated ?
                        <FontAwesomeIcon icon={faCheck} className="yes-icon"/>
                        :
                        <FontAwesomeIcon icon={faTimes} className="no-icon"/>
                      }
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <ReactPaginate
          pageCount={total}
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
