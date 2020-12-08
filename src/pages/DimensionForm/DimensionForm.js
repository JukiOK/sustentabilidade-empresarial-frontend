import React, { useState, useEffect, useRef } from 'react';
import BasePage from '../BasePage/BasePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import {
  getDimension ,
  deleteDimension,
  updateDimension,
  getAllCriteriaDimension,
  saveCriterionDimension,
  deleteCriterionDimension,
  saveIndicatorCriterion,
  updateCriterionDimension,
  updateIndicatorCriterion,
  getAllIndicatorsCriterion,
  deleteIndicatorCriterion,
} from '../../services/requests';
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import colors from '../../constants/colorsobject';
import Criteria from './Criteria';

require('./dimensionForm.scss');

/**
* Componente para página Formulário da dimensão, de criação e edição da dimensão, indicadores e critérios dela, salva automaticamente no input onBlur, ou quando é criado indicador ou critério.
*/

function DimensionForm(props) {

  const [criteriaList, setCriteriaList] = useState([]); //guardar os criterios, com lista de indicadores dentro
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [warning, setWarning] = useState(true);
  const [saving, setSaving] = useState(false);

  let isEdited = useRef(); // ref para verificar se a dimensão criada foi editada e salva
  const { id } = useParams();

  useEffect(() => {
    getInfos();
    return (async () => {
      //Se não houve alguma edição salva na dimensão deve-se apaga-la, para não salvar objetos vazios no banco de dados
      if(isEdited.current === 'no') {
        await deleteDimension(id);
      }
    })
  }, []);

  async function getInfos() {
    let data = await getDimension(id);
    if(data.name) {
      isEdited.current = 'yes';
      setName(data.name);
      setCode(data.code);
      setYear(data.year);
      setDescription(data.description);
      let data1 = await getAllCriteriaDimension(id);
      for(let i = 0; i < data1.length; i++) { //colocar lista de indicadores dentro de seu criterio
        let data2 = await getAllIndicatorsCriterion(id, data1[i]._id);
        data1[i].indicatorsList = data2;
      }
      setCriteriaList(data1);
    } else {
      isEdited.current = 'no';
      setYear(data.year);
    }
  }

  async function addCriterion() {
    //função para adicionar critério
    let data = await saveCriterionDimension(id);
    data.name = '';
    data.weight = '';
    data.description = '';
    data.indicatorsList = [];
    let aux = criteriaList.slice();
    aux.push(data);
    setCriteriaList(aux);
  }

  async function addIndicator(idCriterion, idArray) {
    //função para adicionar indicador, e or argumentos são id do criterio e indice do criterio no vetor
    let data = await saveIndicatorCriterion(id, idCriterion);
    let aux = criteriaList.slice();
    let newIndicator = {
      name: '',
      description: "",
      reference: "",
      weight: 0,
      evidence: false,
      question: {
        title: "",
        type: "",
        answer: []
      },
    };
    aux[idArray].indicatorsList.push({...newIndicator, ...data});
    setCriteriaList(aux);
  }

  async function removeIndicator(indArrayCrit, indArrayIndc) {
    //função para remover indicador, os argumentos são o indice do criterio e indice do indicador
    let aux = criteriaList.slice();
    let indicator = aux[indArrayCrit].indicatorsList[indArrayIndc];
    await deleteIndicatorCriterion(id, indicator.criteriaId, indicator._id);
    aux[indArrayCrit].indicatorsList.splice(indArrayIndc, 1);
    setCriteriaList(aux);
  }

  async function removeCriterion(idCriterion) {
    //função para remover critério, recebe o id do critério
    let aux = criteriaList.slice();
    await deleteCriterionDimension(id, aux[idCriterion]._id);
    aux.splice(idCriterion, 1);
    setCriteriaList(aux);
  }

  function editCriterion(idArray, field, value, idCriterion) {
    //editar informações do criterio, recebe o indice do criterion no array, campo, valor e id do critério
    let newobj = {[field]: value};
    let aux = criteriaList.slice();
    aux[idArray] = {...aux[idArray], ...newobj};
    setCriteriaList(aux);
  }

  // function editIndicator(indArrayCrit, indArrayIndc, field, value) {
  //   console.log(indArrayCrit, indArrayIndc, field, value);
  //   let newobj = {[field]: value};
  //   let aux = [...criteriaList[indArrayCrit].indicatorsList];
  //   aux[indArrayIndc] = {...aux[indArrayIndc], ...newobj};
  //   let aux1 = {...criteriaList[indArrayCrit], ...{indicatorsList: aux}};
  //   console.log(aux);
  //   setCriteriaList(aux);
  // }

  async function saveInfoDimension(field, value) {
    //salvar informação da dimensão, recebe campo e valor
    isEdited.current = 'yes';
    await updateDimension(id, {[field]: value});
  }

  async function saveInfoCriterion(idArray) {
    //salvar informações do critério, recebe indice do critério no vetor
    let criterion = criteriaList[idArray];
    setSaving(true);
    updateCriterionDimension(id, criterion._id, criterion)
    .then(() => {
      setTimeout(() => {setSaving(false)}, 500);
    });
  }

  async function saveInfoIndicator(indArrayCrit, indArrayIndc, body) {
    //salvar informações do indicador, recebe indice do criterio, indice do indicador, e objeto com todas as informações do indicador
    //salva no banco e no state criteriaList
    let indicator = criteriaList[indArrayCrit].indicatorsList[indArrayIndc];
    let list = criteriaList[indArrayCrit].indicatorsList.slice();
    list[indArrayIndc] = {...indicator, ...body}; //modificando indicador
    let listCriteria = criteriaList.slice();
    listCriteria[indArrayCrit].indicatorsList = list; //atualizando lista de indicadores
    setCriteriaList(listCriteria);
    setSaving(true);
    updateIndicatorCriterion(id, indicator.criteriaId, indicator._id, {...indicator, ...body})
    .then(() =>{
      setSaving(false)
    });
  }

  console.log(criteriaList);
  const override = css`margin-left: auto;`;

  return (
    <BasePage title={'Formulário da dimensão'}>
      <div className="dimension-form-container">
        {
          warning &&
          <div className="warning-container">
            <span>O formulário é salvo automaticamente quando é criado critérios e indicadores, e ao preencher um campo.</span>
            <FontAwesomeIcon icon={faTimesCircle} className="icon-trash" style={{marginTop: '0px', marginLeft: 'auto'}} onClick={() => setWarning(false)}/>
          </div>
        }
        {
          saving &&
          <div className="warning-container saving-container">
            <span>Salvando...</span>
            <ClipLoader
              size={20}
              color={colors.black}
              loading={saving}
              css={override}
            />
          </div>
        }
        <span className="dimension-form-title">Informações gerais</span>
        <div className="dimension-form-card">
          <div className="dimension-form-row">
            <div style={{width: '70%'}}>
              <span>Nome</span>
              <input className="input-form" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => saveInfoDimension('name', name)}/>
            </div>
            <div style={{width: '15%', margin: '0px 10px'}}>
              <span>Código</span>
              <input value={code} className="input-form" onChange={(e) => setCode(e.target.value)} onBlur={() => saveInfoDimension('code', code)}/>
            </div>
            <div style={{width: '15%'}}>
              <span>Ano</span>
              <input className="input-form" type="number" value={year} onChange={(e) => setYear(e.target.value)} onBlur={() => saveInfoDimension('year', year)}/>
            </div>
          </div>
          <div className="textarea-container">
            <span>Descrição</span>
            <textarea placeholder="Descrição" className="text-container" value={description} onChange={(e) => setDescription(e.target.value)} onBlur={() => saveInfoDimension('description', description)}/>
          </div>
        </div>
        <div className="dimension-form-row">
          <span className="dimension-form-title">Critérios</span>
          <div className="btn-confirm new-btn" onClick={addCriterion}>Novo critério</div>
        </div>
        {
          criteriaList.map((criterion, index) => (
            <div>
              <Criteria
                key={index}
                indexArray={index}
                criterion={criterion}
                addIndicator={() => addIndicator(criterion._id, index)}
                removeCriterion={() => removeCriterion(index)}
                editCriterion={(index, field, value, idCriterion) => editCriterion(index, field, value, idCriterion)}
                saveInfoCriterion={() => saveInfoCriterion(index)}
                removeIndicator={(indArrayIndc) => removeIndicator(index, indArrayIndc)}
                saveInfoIndicator={(indArray, body) => saveInfoIndicator(index, indArray, body)}
              />
              <hr/>
            </div>
          ))
        }
        <div className="btn-confirm save-btn" >Salvar</div>
      </div>
    </BasePage>
  )
}

export default DimensionForm;
