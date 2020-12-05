import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import colorsobject from '../../constants/colorsobject';
import { createOrganization, getOrganization, getMe, updateOrganization, getCategories, getSectors, getNumbEmp } from '../../services/requests';
import SaveBtn from '../../components/SaveBtn/SaveBtn';

require('./organizationProfile.scss');

/**
* Componente para a página de Perfil da instituição.
*/

function OrganizationProfile(props) {

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [site, setSite] = useState('');
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');
  const [cep, setCep] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [numberEmp, setNumberEmp] = useState('');
  const [isNew, setIsNew] = useState();
  const [orgId, setOrgId] = useState();
  const [listCategories, setListCategories] = useState();
  const [listSectors, setListSectors] = useState();
  const [listNumbEmp, setListNumbEmp] = useState();
  const [errorName, setErrorName] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getOrg();
  }, []);

  async function getOrg() {
    let categoryList = await getCategories();
    let sectorsList = await getSectors();
    let numbEmpList = await getNumbEmp();
    setListCategories(categoryList);
    setListSectors(sectorsList);
    setListNumbEmp(numbEmpList);
    let me = await getMe();
    if(me && me.orgId) {
      setIsNew(false);
      setOrgId(me.orgId);
      let data = await getOrganization(me.orgId);
      setName(data.name);
      setPhone(data.phone);
      setSite(data.site);
      setCategory(data.category);
      setSector(data.sector);
      setNumberEmp(data.size);
      if(data.address) {
        setAddress(data.address.address);
        setNumber(data.address.number);
        setCep(data.address.cep);
        setState(data.address.state);
        setCity(data.address.city);
      }
    } else {
      setIsNew(true);
    }
  }

  async function cepAutocomplete() {
    //utilizando API para obter endereço pelo CEP
    const response = await axios({
      url: 'https://viacep.com.br/ws/'  + cep + '/json/',
      method: 'get',
    })
    setState(response.data.uf);
    setCity(response.data.localidade);
    setAddress(response.data.logradouro);
  }

  function saveOrg() {
    const addressFull = {address, cep, state, city, number};
    if(name && category) {
      setSaving(true);
      if(isNew) {
        createOrganization({name, address: {...addressFull}, phone, site, category, sector, size: numberEmp})
        .then(() => {
          setIsNew(false);
          setSaving(false);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
      } else {
        updateOrganization({name, address: {...addressFull}, phone, site, category, sector, size: numberEmp})
        .then(() => {
          setSaving(false);
        })
        .catch((error) => {
          alert(error);
        });
      }
    } else {
      // se nome da organização esta vazio não pode salvar
      if(!name) {
        setErrorName(true);
      }
      //se categoria da organização esta vaiza também não pode salvar
      if(!category) {
        setErrorCategory(true);
      }
    }
  }

  return (
    <BasePage title={'Perfil da Instituição'}>
      <div className="profile-container">
        <div>
          <span>Identificação da instituição</span>
        </div>
        <input className={errorName && "error-input"} placeholder="Nome da instituição" onChange={e => setName(e.target.value)} value={name} onFocus={() => setErrorName(false)} />
        {
          errorName &&
          <div style={{color: colorsobject.red}}>Campo obrigatório</div>
        }
        <div className="profile-row">
          <InputMask value={phone} mask="(99) 9999-9999" maskChar="_" placeholder="Telefone" onChange={e => setPhone(e.target.value)}/>
          <input placeholder="Site" style={{marginLeft: '10px'}} value={site} onChange={e => setSite(e.target.value)}/>
        </div>
        <div className="profile-row">
          <InputMask mask="99999-999" maskChar="_"  placeholder="CEP" onChange={e => setCep(e.target.value)} value={cep}/>
          <button onClick={cepAutocomplete} className="btn-search"><FontAwesomeIcon icon={faSearch} /></button>
          <input placeholder="Estado" onChange={e => setState(e.target.value)} style={{margin: '0px 10px'}} value={state}/>
          <input placeholder="Cidade" onChange={e => setCity(e.target.value)} value={city}/>
        </div>
        <div className="profile-row">
          <input placeholder="Endereço principal"  onChange={e => setAddress(e.target.value)} value={address}/>
          <input placeholder="Número" onChange={e => setNumber(e.target.value)} style={{marginLeft: '10px'}} value={number}/>
        </div>
        <div className="profile-title">
          <span>Atividade</span>
          <p style={{margin: '10px 0px'}}>Se sua empresa atua em vários setores, selecione a opção que melhor representa a maior atividade operacional da empresa em termos de receita geral</p>
        </div>
        <select className={"profile-select " + (errorCategory && "error-input")} onChange={e => setCategory(e.target.value)} value={category} onFocus={() => setErrorCategory(false)}>
          <option value="" disabled selected hidden>Categoria</option>
          {
            listCategories && listCategories.map((category, index) => {
              return (
                <option key={index} value={category.value}>{category.label}</option>
              )
            })
          }
        </select>
        {
          errorCategory &&
          <div style={{color: colorsobject.red}}>Campo obrigatório</div>
        }
        <select className="profile-select" onChange={e => setSector(e.target.value)} value={sector}>
          <option value="" disabled selected hidden>Setor</option>
          {
            listSectors && listSectors.map((sector, index) => {
              return (
                <option key={index} value={sector.value}>{sector.label}</option>
              )
            })
          }
        </select>
        <div className="profile-title size-title">
          <span>Porte da instituição</span>
        </div>
        <select className="profile-select" value={numberEmp} onChange={e => setNumberEmp(e.target.value)}>
          <option value="" disabled selected hidden>Número de funcionários</option>
          {
            listNumbEmp && listNumbEmp.map((numbEmp, index) => {
              return (
                <option key={index} value={numbEmp.value}>{numbEmp.label}</option>
              )
            })
          }
        </select>

        <SaveBtn save={saveOrg} saving={saving}/>

      </div>
    </BasePage>
  )
}

export default OrganizationProfile;
