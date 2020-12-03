import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getOrganizationsList, getCategories, getSectors } from '../../services/requests';
import ReactPaginate from 'react-paginate';
import { faSearch, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

require('./organizations.scss');

function Organizations(props) {

  const [orgList, setOrgList] = useState([]);
  const [total, setTotal] = useState();
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [translateCategory, setTranslateCategory] = useState();
  const [translateSector, setTranslateSector] = useState();
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');

  useEffect(() => {
    getInfos();
  }, []);

  async function getInfos() {
    let data = await getList(0);
    setTotal(Math.ceil(data.total/ data.pageSize));
    let data1 = await getCategories();
    let data2 = await getSectors();
    setCategories(data1);
    setSectors(data2);
    let aux = {};
    let aux1 = {};
    for(let i = 0; i < data1.length; i++) {
      aux[data1[i].value] = data1[i].label;
    }
    setTranslateCategory(aux);
    for(let i = 0; i < data2.length; i++) {
      aux1[data2[i].value] = data2[i].label;
    }
    setTranslateSector(aux1);
  }

  async function getList(page) {
    let data = await getOrganizationsList({page, name, pageSize: 10, category, sector});
    setOrgList(data.results);
    return data;
  }

  return (
    <BasePage title={'Instituições'}>
      <div className="organizations-container">
        <div style={{display: 'flex', marginBottom: '10px'}}>
          <span style={{marginRight: '10px'}}>Pesquisar:</span>
          <input placeholder={'Filtrar por nome'} value={name} onChange={e => setName(e.target.value)}/>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="" disabled selected hidden>Categoria</option>
            {
              categories.map((cat, index) => (
                <option key={index} value={cat.value}>{cat.label}</option>
              ))
            }
          </select>
          <select value={sector} onChange={e => setSector(e.target.value)}>
            <option value="" disabled selected hidden>Setor</option>
            {
              sectors.map((sect, index) => (
                <option key={index} value={sect.value}>{sect.label}</option>
              ))
            }
          </select>
          <button className="btn-search" onClick={() => getList(0)}><FontAwesomeIcon icon={faSearch} /></button>
        </div>
        <table className="table-users">
          <thead>
            <tr>
              <th className="table-cell">Nome</th>
              <th className="table-cell">Categoria</th>
              <th className="table-cell">Setor</th>
            </tr>
          </thead>
          <tbody>
            {
              translateSector && translateCategory && orgList.map((org, index) => (
                <tr className="table-row" key={index}>
                  <td className="table-cell">
                    {org.name}
                  </td>
                  <td className="table-cell">
                    {translateCategory[org.category]}
                  </td>
                  <td className="table-cell">
                    {translateSector[org.sector]}
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

export default Organizations;
