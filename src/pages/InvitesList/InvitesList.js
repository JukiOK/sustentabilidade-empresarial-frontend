import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getInvitesList, sendInvite, acceptInvite, markInvite, deleteInvite } from '../../services/requests';
import { useDispatch, useSelector } from 'react-redux';
import { setInvites } from '../../redux/actions/invitesAction';
import { faCheck, faTimes, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Overlay from '../../components/Overlay/Overlay';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { setHasNew } from '../../redux/actions/invitesAction';

require('./invitesList.scss');

/**
* Componente para ver convites enviados.
*/

export function SentInvites(props) {

  const { inviteList, setId, setSelectedIndex, setOpenOverlay } = props;

  function handleDelete(id, index) {
    setId(id);
    setSelectedIndex(index);
    setOpenOverlay();
  }

  return (
    <div>
      {
        inviteList.length > 0 ?
        <table className="table">
          <thead>
            <tr>
              <th className="table-cell">Enviado para</th>
              <th className="table-cell">Visto</th>
              <th className="table-cell">Aceito</th>
              <th className="table-cell"></th>
            </tr>
          </thead>
          <tbody>
            {
              inviteList.map((invite, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">{invite.toUserEmail}</td>
                  <td className="table-cell">
                    <div className="icon-container">
                      {
                        invite.seen ? <FontAwesomeIcon icon={faCheck} className="icon-check"/> : <FontAwesomeIcon icon={faTimes} className="icon-times"/>
                      }
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="icon-container">
                      {
                        invite.accepted ? <FontAwesomeIcon icon={faCheck} className="icon-check"/> : <FontAwesomeIcon icon={faTimes} className="icon-times"/>
                      }
                    </div>
                  </td>
                  <td className="table-cell" style={{width: '10px'}}>
                    <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={() => handleDelete(invite._id, index)}/>
                  </td>
                </tr>
              ))

            }
          </tbody>
        </table>
        :
        <div className="no-msg">
          <span>Não há convites</span>
        </div>
      }
    </div>
  )
}

/**
* Componente para ver convites recebidos.
*/

export function ReceivedInvites(props) {

  const { inviteList, setId, setSelectedIndex, setOpenOverlay } = props;

  const history = useHistory();

  function handleDelete(id, index) {
    setId(id);
    setSelectedIndex(index);
    setOpenOverlay();
  }

  return (
    <div>
        {
          inviteList.length > 0 ?
          <table className="table">
            <thead>
              <tr>
                <th className="table-cell">Enviado por</th>
                <th className="table-cell">Organização</th>
                <th className="table-cell">Visto</th>
                <th className="table-cell">Aceito</th>
                <th className="table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {
                inviteList.map((invite, index) => (
                  <tr key={index} className="table-row received-invites" onClick={() => history.push('/invites/' + invite._id)}>
                    <td className="table-cell">{invite.fromUserEmail}</td>
                    <td className="table-cell">{invite.organization && invite.organization.name}</td>
                    <td className="table-cell">
                      <div className="icon-container">
                        {
                          invite.seen ? <FontAwesomeIcon icon={faCheck} className="icon-check"/> : <FontAwesomeIcon icon={faTimes} className="icon-times"/>
                        }
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="icon-container" onClick={(e) => e.stopPropagation()}>
                        {
                          invite.accepted ?
                          <FontAwesomeIcon icon={faCheck} className="icon-check"/>
                          :
                          <FontAwesomeIcon icon={faTimes} className="icon-times"/>
                        }
                      </div>
                    </td>
                    <td className="table-cell" style={{width: '10px'}} onClick={(e) => e.stopPropagation()}>
                      <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={() => handleDelete(invite._id, index)}/>
                    </td>
                  </tr>
                ))

              }
            </tbody>
          </table>
        :
        <div className="no-msg">
          <span>Não há convites</span>
        </div>
      }
    </div>
  )
}

/**
* Componente para tela de convites.
*/

function InvitesList(props) {

  const [invitesSentList, setInvitesSentList] = useState([]);
  const [invitesReceivedList, setInvitesReceivedList] = useState([]);
  const [email, setEmail] = useState('');
  const [isReceive, setIsReceive] = useState(true);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [id, setId] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user && state.user.userInfo);
  const invitesList = useSelector(state => state.invites && state.invites.list);

  useEffect(() => {
    if(user) {
      getInvites();
    }
  }, [user]);

  async function getInvites() {
    let data = await getInvitesList();
    let sent = [];
    let receive = [];
    //separar uma lista de convites enviados e outra de recebidos
    for(let i = 0; i < data.length; i++) {
      let invite = data[i];
      if(invite.fromUserEmail === user.email) { //convite foi enviado
        sent.push(invite);
      } else if(invite.toUserEmail === user.email){ //convite foi recebido
        if(!invite.seen) { //marcar os convites como visto
          handleMarkSeen(invite._id);
          invite.seen = true;
        }
        receive.push(invite);
      }
    }
    dispatch(setHasNew(false));
    setInvitesSentList(sent);
    setInvitesReceivedList(receive);
    dispatch(setInvites({sent, receive}))
  }

  async function handleMarkSeen(id) {
    return await markInvite(id);
  }

  function inviteUser() {
    sendInvite({email}).then(() => {
      getInvites();
      setIsReceive(false);
    })
    .catch((err) => {
      if(err.response && err.response.data) {
        if(err.response.data.message === 'Organization id not found') {
          alert('Você ainda não possui uma organização para convidar o usuário, por favor crie uma');
        }
      }
    });
  }

  async function handleDelete() {
    await deleteInvite(id);
    if(isReceive) { //remover convite da lista de recebidos
      let aux = invitesReceivedList.slice();
      aux.splice(selectedIndex, 1);
      setInvitesReceivedList(aux);
    } else { //remover convite da lista de enviados
      let aux = invitesSentList.slice();
      aux.splice(selectedIndex, 1);
      setInvitesSentList(aux);
    }
    setOpenOverlay(false);
  }

  return (
    <BasePage title={'Lista de convites'}>
      <div className="invites-container">
        <Overlay openOverlay={openOverlay} setOpenOverlay={(value) => setOpenOverlay(value)}>
          <div>
            <span>Tem certeza que deseja apagar o convite?</span>
            <div className="row">
              <div className="btn-confirm yes-btn" onClick={handleDelete}>Deletar</div>
              <div className="btn-confirm cancel-btn" onClick={() => setOpenOverlay(false)}>Cancelar</div>
            </div>
          </div>
        </Overlay>
        <div className="invites-user-container">
          <input style={{width: '300px'}} value={email} onChange={e => setEmail(e.target.value)} placeholder="Insira email do usuário a ser convidado"/>
          <div className="btn-confirm invite-btn" onClick={inviteUser}>Convidar usuário</div>
          <FontAwesomeIcon icon={faUndo} className="icon-refresh" onClick={getInvites}/>
        </div>
        <div className="invites-tab-container">
          <div className={"invites-tab " + (!isReceive && 'inactive-tab') } onClick={() => setIsReceive(true)}>
            <span>Recebidos</span>
          </div>
          <div className={"invites-tab sent-tab " + (isReceive && 'inactive-tab')} onClick={() => setIsReceive(false)}>
            <span>Enviados</span>
          </div>
        </div>
        {
          isReceive ?
          <ReceivedInvites inviteList={invitesReceivedList} setId={id => setId(id)} setSelectedIndex={index => setSelectedIndex(index)} setOpenOverlay={() => setOpenOverlay(true)}/>
          :
          <SentInvites inviteList={invitesSentList} setId={id => setId(id)} setSelectedIndex={index => setSelectedIndex(index)} setOpenOverlay={() => setOpenOverlay(true)}/>
        }
      </div>
    </BasePage>
  )
}

export default InvitesList;

SentInvites.propTypes = {
  /**
  * lista de convites
  */
  inviteList: PropTypes.array.isRequired,
  /**
  * função para atribuir id do convite selecionado
  */
  setId: PropTypes.func.isRequired,
  /**
  * função para atribuir o indice no vetor de convites do convite selecionado
  */
  setSelectedIndex: PropTypes.func.isRequired,
  /**
  * função para abrir ou fechar o popup
  */
  setOpenOverlay: PropTypes.func.isRequired,
}

ReceivedInvites.propTypes = {
  /**
  * lista de convites
  */
  inviteList: PropTypes.array.isRequired,
  /**
  * função para atribuir id do convite selecionado
  */
  setId: PropTypes.func.isRequired,
  /**
  * função para atribuir o indice no vetor de convites do convite selecionado
  */
  setSelectedIndex: PropTypes.func.isRequired,
  /**
  * função para abrir ou fechar o popup
  */
  setOpenOverlay: PropTypes.func.isRequired,
}
