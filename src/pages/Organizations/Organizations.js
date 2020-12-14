import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getOrganizationsList, getCategories, getSectors, deleteOrganizationById } from '../../services/requests';
import ReactPaginate from 'react-paginate';
import { faSearch, faAngleLeft, faAngleRight, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import Overlay from '../../components/Overlay/Overlay';
import { removeOrganization } from '../../redux/actions/organizationAction';
import { useDispatch, useSelector } from 'react-redux';

require('./organizations.scss');

/**
* Componente para página de lista de organizações.
*/

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
  const [selectedOrg, setSelectedOrg] = useState('');
  const [indexOrg, setIndexOrg] = useState('');
  const [open, setOpen] = useState(false);
  const [selectPage, setSelectPage] = useState(0);
  const dispatch = useDispatch();
  const org = useSelector(state => state.organization && state.organization.mineOrg);

  useEffect(() => {
    getInfos();
  }, []);

  async function getInfos() {
    let data = await getList(0);
    setTotal(Math.ceil(data.total/ data.pageSize)); //para calcular a quantidade de páginas
    let data1 = await getCategories();
    let data2 = await getSectors();
    setCategories(data1);
    setSectors(data2);
    let aux = {};
    let aux1 = {};
    //guardando categorias por {value: label}, para facilitar a tradução
    for(let i = 0; i < data1.length; i++) {
      aux[data1[i].value] = data1[i].label;
    }
    setTranslateCategory(aux);
    //guardando setores por {value: label}, para facilitar a tradução
    for(let i = 0; i < data2.length; i++) {
      aux1[data2[i].value] = data2[i].label;
    }
    setTranslateSector(aux1);
  }

  async function getList(page) {
    //função para filtrar lista de organizações
    setSelectPage(page);
    let body = {page, name, pageSize: 10};
    if(category) {
      body.category = category;
    }
    if(sector) {
      body.sector = sector;
    }
    let data = await getOrganizationsList(body);
    setOrgList(data.results);
    setTotal(Math.ceil(data.total/body.pageSize));
    return data;
  }

  function cleanFilters() {
    setName('');
    setCategory('');
    setSector('');
  }

  function handleClickDelete(index) {
    //função para abrir overlay de confirmação de remoção da organização
    setIndexOrg(index);
    setSelectedOrg(orgList[index]);
    setOpen(true);
  }

  async function removeOrg() {
    await deleteOrganizationById(selectedOrg._id);
    if(selectedOrg._id === org._id) {
      dispatch(removeOrganization());
    }
    getList(0);
    setOpen(false);
    setSelectPage(0);
  }

  return (
    <BasePage title={'Instituições'}>
      <div className="organizations-container">
        <Overlay openOverlay={open} setOpenOverlay={(value) => setOpen(value)}>
          <span>
            Tem certeza que deseja apagar a organização? Essa ação não pode ser desfeita.
          </span>
          <div className="row">
            <div className="btn-confirm yes-btn" onClick={removeOrg}>Sim</div>
            <div className="btn-confirm cancel-btn" onClick={() => setOpen(false)}>Não</div>
          </div>
        </Overlay>
        <div style={{display: 'flex', marginBottom: '10px'}}>
          <input placeholder={'Nome'} value={name} onChange={e => setName(e.target.value)}/>
          <select value={category} onChange={e => setCategory(e.target.value)} className="filter-category">
            <option value="" selected>Selecionar categoria</option>
            {
              categories.map((cat, index) => (
                <option key={index} value={cat.value}>{cat.label}</option>
              ))
            }
          </select>
          <select value={sector} onChange={e => setSector(e.target.value)} className="filter-sector">
            <option value="" selected >Selecionar setor</option>
            {
              sectors.map((sect, index) => (
                <option key={index} value={sect.value}>{sect.label}</option>
              ))
            }
          </select>
          <button className="btn-search" onClick={() => getList(0)}><FontAwesomeIcon icon={faSearch} /></button>
          <div className="btn-clean" onClick={cleanFilters}>
            <FontAwesomeIcon icon={faTimesCircle}/>
          </div>
        </div>
        <table className="table-users">
          <thead>
            <tr>
              <th className="table-cell">Nome</th>
              <th className="table-cell">Categoria</th>
              <th className="table-cell">Setor</th>
              <th className="table-cell"></th>
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
                  <td className="table-cell" style={{width: '10px'}}>
                    <FontAwesomeIcon icon={faTrashAlt} className="btn-clean" style={{margin: '0px'}} onClick={() => handleClickDelete(index)}/>
                  </td>
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

export default Organizations;
