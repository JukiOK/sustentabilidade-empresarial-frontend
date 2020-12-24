import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getInvitesList, sendInvite } from '../../services/requests';
import { useDispatch, useSelector } from 'react-redux';
import { setInvites } from '../../redux/actions/invitesAction';
import { faCheck, faTimes, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Overlay from '../../components/Overlay/Overlay';

require('./invites.scss');

/**
* Componente para ver convites enviados.
*/

export function SentInvites(props) {

  const { inviteList } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="table-cell">Email</th>
          <th className="table-cell">Visto</th>
          <th className="table-cell">Aceito</th>
        </tr>
      </thead>
      <tbody>
        {
          inviteList.map((invite, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell">{invite.toUserEmail}</td>
              <td className="table-cell">
                {
                  invite.seen ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />
                }
              </td>
              <td className="table-cell">
                {
                  invite.accept ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />
                }
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export function ReceivedInvites(props) {

  const { inviteList } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="table-cell">Email</th>
          <th className="table-cell">Visto</th>
          <th className="table-cell">Aceito</th>
        </tr>
      </thead>
      <tbody>
        {
          inviteList.map((invite, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell">{invite.fromUserEmail}</td>
              <td className="table-cell">
                {
                  invite.seen ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />
                }
              </td>
              <td className="table-cell">
                {
                  invite.accept ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />
                }
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

/**
* Componente para tela de convites.
*/

function Invites(props) {

  const [invitesSentList, setInvitesSentList] = useState([]);
  const [invitesReceivedList, setInvitesReceivedList] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user && state.user.userInfo);

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
      if(data[i].fromUserEmail === user.email) { //convite foi enviado
        sent.push(data[i]);
      } else if(data[i].toUserEmail === user.email){ //convite foi recebido
        receive.push(data[i]);
      }
    }
    setInvitesSentList(sent);
    setInvitesReceivedList(receive);
  }

  function inviteUser() {
    sendInvite({email}).then(() => {
      getInvites();
    })
    .catch((err) => {
      if(err.response && err.response.data) {
        if(err.response.data.message === 'Organization id not found') {
          alert('Você ainda não possui uma organização para convidar o usuário, por favor crie uma');
        }
      }
    });
  }

  return (
    <BasePage title={'Lista de convites'}>
      <div>
        <div>
          <input value={email} onChange={e => setEmail(e.target.value)}/>
          <div className="btn-confirm" onClick={inviteUser}>Convidar usuário</div>
        </div>
        <SentInvites inviteList={invitesSentList} />
        <ReceivedInvites inviteList={invitesReceivedList} />
      </div>
    </BasePage>
  )
}

export default Invites;
