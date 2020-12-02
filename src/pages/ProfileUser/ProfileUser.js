import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getMe, updateMe, deleteMe, getOrganization } from '../../services/requests';
import firebase from 'firebase';
import SaveBtn from '../../components/SaveBtn/SaveBtn';

require('./profileUser.scss');

function ProfileUser(props) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [oldEMail, setOldEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getInfos();
  }, []);

  async function getInfos() {
    let data = await getMe();
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
    data = await getOrganization();
    if(data) {
      setOrganization(data.name);
    }
  }

  async function updateUser() {
    setSaving(true);
    changeEmail().then(async () => {
      await updateMe({firstName, lastName, email});
      setSaving(false);
    })
  }

  async function changeEmail() {
    let user = await firebase.auth().currentUser;
    return user.updateEmail(email).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
      handleError();
    });
  }

  async function changePassword() {
    let user = firebase.auth().currentUser;
    setSaving(true);
    user.updatePassword(password).then(function() {
      // Update successful.
      setSaving(false);
    }).catch(function(error) {
      // An error happened.
      handleError();
    });
  }

  async function deleteUser() {
    let user = firebase.auth().currentUser;
    user.delete().then(function() {
      // User deleted.
    }).catch(function(error) {
      // An error happened.
      handleError();
    });
  }

  function handleError() {
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/recoverpassword') { //Redirect to login screen
      alert("Desculpe, sua sessão expirou. Por favor entre novamente.");
      let path = encodeURIComponent(window.location.pathname);
      window.location.href = "/login?previous=" + path;
    }
  }

  return (
    <BasePage title={'Meu perfil'}>
      <div className="profile-user-container">
        <div className="card">
          <div className="row">
            <div className="text-input-half" style={{marginRight: '10px'}}>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={'Nome'} style={{marginTop: '0px'}}/>
            </div>
            <div className="text-input-half">
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder={'Sobrenome'} style={{marginTop: '0px'}}/>
            </div>
          </div>
          <div className="text-input-container">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder={'Email'}/>
          </div>
          <div className="text-input-container">
            <span className="text-title">Organização</span>
            <input value={organization} disabled />
          </div>
          <div style={{display: 'flex'}}>
            <SaveBtn save={updateUser} saving={saving} style={{fontSize: '16px'}}/>
            <div className="btn-confirm delete-btn">Deletar conta</div>
          </div>
        </div>
        <div className="card">
          <span className="text-title">Alterar senha</span>
          <input value={password} placeholder="Insira nova senha" onChange={e => setPassword(e.target.value)}/>
          <input value={confirm} placeholder="Confirme a nova senha" onChange={e => setConfirm(e.target.value)} />
          <SaveBtn save={changePassword} saving={saving} style={{fontSize: '16px'}} classBtn={'save-pass'}/>
        </div>
      </div>
    </BasePage>
  )
}

export default ProfileUser;
