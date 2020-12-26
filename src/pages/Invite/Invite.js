import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { useParams } from 'react-router-dom';
import { getInvite, acceptInvite } from '../../services/requests';
import Overlay from '../../components/Overlay/Overlay';

require('./invite.scss');

function Invite(props) {
  const params = useParams();
  const [invite, setInvite] = useState({});
  const [openOverlay, setOpenOverlay] = useState(false);

  useEffect(() => {
    getInfo();
  }, []);

  async function getInfo() {
    let data = await getInvite(params.id);
    setInvite(data);
  }

  async function accept() {
    await acceptInvite(params.id);
    let aux = {...invite};
    aux.accepted = true;
    setInvite(aux);
    setOpenOverlay(false);
  }

  return (
    <BasePage title={'Convite'} backBtn>
      <div className="invite-container">
        <Overlay openOverlay={openOverlay} setOpenOverlay={(value) => setOpenOverlay(value)}>
          <div>
            <span>Deseja aceitar o convite? Se ja estiver em uma organização você perderá o acesso aos conteúdos da sua organização atual.</span>
            <div className="row">
              <div className="btn-confirm yes-btn" onClick={accept}>Aceitar</div>
              <div className="btn-confirm cancel-btn" onClick={() => setOpenOverlay(false)}>Cancelar</div>
            </div>
          </div>
        </Overlay>
        <div className="invite-content">
          <span>Enviado por: {invite.fromUserEmail}</span>
          {
            invite.organization  &&
            <div>
              <span>Organização</span>
              <p>Nome: {invite.organization.name}</p>
              {
                invite.organization.address &&
                <div>
                  <p>Endereço:</p>
                  <p>{invite.organization.address.address}, {invite.organization.address.number} </p>
                  <p>{invite.organization.address.cep} - {invite.organization.address.city}, {invite.organization.address.state}</p>
                </div>
              }
            </div>
          }
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span>Status: {invite.accepted ? 'Aceito' : 'Não aceito'}</span>
            {
              !invite.accepted &&
              <div className="btn-confirm" onClick={() => setOpenOverlay(true)}>Aceitar</div>
            }
          </div>
        </div>
      </div>
    </BasePage>
  )
}

export default Invite;
