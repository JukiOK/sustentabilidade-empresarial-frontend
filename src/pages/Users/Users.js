import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getUsersList } from '../../services/requests';
import ReactPaginate from 'react-paginate';
import { faSearch, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

require('./users.scss');

function Users(props) {

  const [userList, setUserList] = useState([]);
  const [total, setTotal] = useState();
  const [name, setName] = useState('');

  useEffect(() => {
    getInfos();
  }, []);

  async function getInfos() {
    let data = await getList(0);
  }

  async function getList(page) {
    let data = await getUsersList({page, name, pageSize: 10});
    setUserList(data.results);
    setTotal(Math.ceil(data.total/10));
    return data;
  }

  return (
    <BasePage title={'Usuários'}>
      <div className="users-container">
        <div style={{display: 'flex', marginBottom: '10px'}}>
          <input placeholder={'Filtrar por nome'} value={name} onChange={e => setName(e.target.value)}/>
          <button className="btn-search" onClick={getList}><FontAwesomeIcon icon={faSearch} /></button>
        </div>
        <table className="table-users">
          <thead>
            <tr>
              <th className="table-cell">Nome</th>
              <th className="table-cell">Email</th>
            </tr>
          </thead>
          <tbody>
            {
              userList.map((user, index) => (
                <tr className="table-row" key={index}>
                  <td className="table-cell">
                    {user.firstName + ' ' + user.lastName}
                  </td>
                  <td className="table-cell">
                    {user.email}
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

export default Users;
