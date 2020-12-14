import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getMe, updateMe, deleteMe, getOrganization } from '../../services/requests';
import firebase from 'firebase';
import SaveBtn from '../../components/SaveBtn/SaveBtn';
import Overlay from '../../components/Overlay/Overlay';
import { setUser } from '../../redux/actions/userAction';
import { useDispatch } from 'react-redux';

require('./profileUser.scss');

/**
* Componente para página perfil do usuário.
*/

function ProfileUser(props) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [oldEmail, setOldEmail] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [type, setType] = useState();
  const [errorSign, setErrorSign] = useState(false);
  const dispatch = useDispatch();

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
      //função para atualizar dados do usuário no banco de dados
      let data = await updateMe({firstName, lastName, email});
      dispatch(setUser(data));
      setSaving(false);
    })
  }

  async function changeEmail() {
    //função do firebase para atualizar email
    let user = await firebase.auth().currentUser;
    return user.updateEmail(email).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
      handleError(error);
    });
  }

  async function changePassword() {
    if(password === confirm) { //checar se a nova senha e sua confirmação são iguais
      let user = firebase.auth().currentUser;
      setSavingPass(true);
      //atualizar a senha no firebase
      user.updatePassword(password).then(function() {
        // Update successful.
        setSavingPass(false);
      }).catch(function(error) {
        // An error happened.
        setSavingPass(false);
        handleError(error);
      });
    } else {
      setErrorPass(true);
    }
  }

  async function deleteUser() {
    let user = firebase.auth().currentUser;
    //função para deletar conta primeiro no banco de dados e depois no firebase
    await deleteMe();
    user.delete().then(async function() {
      props.history.push('/login');
    }).catch(function(error) {
      // An error happened.
      handleError(error);
    });
  }

  function handleError(error) {
    if(error.code === 'auth/weak-password') {
      alert('A senha precisa ter no minimo 6 caracteres');
    }
  }

  async function reauth() {
    //função para raautenticar o usuário, para permitir mudança de email, senha e deletar conta
    firebase.auth().signInWithEmailAndPassword(oldEmail, oldPass).then(() => {
      setOpenSignin(false);
      let user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPass
      );
      user.reauthenticateWithCredential(credential).then(function() {
        // User re-authenticated.
        setOpen(false);
        if(type === 'email') {
          updateUser();
        } else if(type === 'password') {
          changePassword();
        } else if(type === 'delete') {
          deleteUser();
        }
      }).catch(function(error) {
        // An error happened.
      });
    }).catch(function(error) {
      // An error happened.
      setErrorSign(true);
    });
  }

  function handleSave(typeAction) {
    setOpenSignin(true);
    setType(typeAction);
  }

  return (
    <BasePage title={'Meu perfil'}>
      <div className="profile-user-container">
        <Overlay openOverlay={open} setOpenOverlay={(value) => setOpen(value)}>
          <div>
            <span>Tem certeza que deseja excluir a conta? Essa ação não pode ser desfeita.</span>
            <div style={{display: 'flex', marginTop: '10px'}}>
              <div className="btn-confirm" onClick={() => handleSave('delete')}>
                Sim
              </div>
              <div className="btn-confirm delete-btn" onClick={() => setOpen(false)}>
                Não
              </div>
            </div>
          </div>
        </Overlay>
        <Overlay openOverlay={openSignin} setOpenOverlay={(value) => setOpenSignin(value)}>
          <div>
            <span>Para realizar a ação é necessário inserir novamente seu login</span>
            <input placeholder={'Email'} value={oldEmail} onChange={(e) => setOldEmail(e.target.value)} type="email" onFocus={() => setErrorSign(false)}/>
            <input placeholder={'Senha'} value={oldPass} onChange={(e) => setOldPass(e.target.value)} type="password" onFocus={() => setErrorSign(false)}/>
            {
              errorSign &&
              <div className="error-text">Email ou senha invalida</div>
            }
            <div className="btn-confirm save-pass" onClick={reauth}>Enviar</div>
          </div>
        </Overlay>
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
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={'Email'}/>
          </div>
          <div className="text-input-container">
            <span className="text-title">Organização</span>
            <input value={organization} disabled />
          </div>
          <div style={{display: 'flex'}}>
            <SaveBtn save={() => handleSave('email')} saving={saving} style={{fontSize: '16px'}}/>
            <div className="btn-confirm delete-btn" onClick={() => setOpen(true)}>Deletar conta</div>
          </div>
        </div>
        <div className="card">
          <span className="text-title">Alterar senha</span>
          <p style={{marginBottom: '0px'}}>A senha deve ter no mínimo 6 caracteres</p>
          <input type="password" value={password} placeholder="Insira nova senha" onChange={e => setPassword(e.target.value)} onFocus={() => setErrorPass(false)}/>
          <input type="password" value={confirm} placeholder="Confirme a nova senha" onChange={e => setConfirm(e.target.value)} onFocus={() => setErrorPass(false)}/>
          {
            errorPass &&
            <div className="error-text">As senhas não são as mesmas</div>
          }
          <SaveBtn save={() => handleSave('password')} saving={savingPass} style={{fontSize: '16px'}} classBtn={'save-pass'}/>
        </div>
      </div>
    </BasePage>
  )
}

export default ProfileUser;
