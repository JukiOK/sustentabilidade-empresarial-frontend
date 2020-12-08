import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getUsersList, grantAdmin, revokeAdmin } from '../../services/requests';
import ReactPaginate from 'react-paginate';
import { faSearch, faAngleLeft, faAngleRight, faCheck, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Overlay from '../../components/Overlay/Overlay';

require('./users.scss');

/**
* Componente para página de lista de usuários.
*/

function Users(props) {

  const [userList, setUserList] = useState([]);
  const [total, setTotal] = useState();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [indexUser, setIndexUser] = useState('');

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

  function handleClickAdmin(index) {
    //função para abrir overlay para mudar permissão de administrador, salva usuário e indice do usuário selecionado
    setOpen(true);
    setSelectedUser(userList[index]);
    setIndexUser(index);
  }

  async function changeAdmin() {
    let aux = userList.slice();
    if(selectedUser.isAdmin) {
      await revokeAdmin(selectedUser._id);
      aux[indexUser].isAdmin = false;
    } else {
      await grantAdmin(selectedUser._id);
      aux[indexUser].isAdmin = true;
    }
    setUserList(aux);
    setOpen(false);
  }

  return (
    <BasePage title={'Usuários'}>
      <div className="users-container">
        <Overlay openOverlay={open} setOpenOverlay={(value) => setOpen(value)}>
          <span>
            Deseja {selectedUser.isAdmin ? 'remover' : 'conceder'} permissão de administrador para usuário {selectedUser.firstName + ' ' + selectedUser.lastName}?
          </span>
          <div className="row">
            <div className="btn-confirm yes-btn" onClick={changeAdmin}>Sim</div>
            <div className="btn-confirm cancel-btn" onClick={() => setOpen(false)}>Não</div>
          </div>
        </Overlay>
        <div style={{display: 'flex', marginBottom: '10px'}}>
          <input placeholder={'Filtrar por nome'} value={name} onChange={e => setName(e.target.value)}/>
          <button className="btn-search" onClick={getList}><FontAwesomeIcon icon={faSearch} /></button>
        </div>
        <table className="table-users">
          <thead>
            <tr>
              <th className="table-cell">Nome</th>
              <th className="table-cell">Email</th>
              <th className="table-cell">Administrador</th>
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
                  <td className="table-cell" style={{width: '10%'}}>
                    <div className="admin-cell">
                      {
                        user.isAdmin ?
                        <FontAwesomeIcon icon={faCheck} className="yes-admin" onClick={() => handleClickAdmin(index)}/>
                        :
                        <FontAwesomeIcon icon={faTimes} className="no-admin" onClick={() => handleClickAdmin(index)}/>
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

export default Users;
