import React, { useState, useEffect, useRef } from 'react';
import BasePage from '../BasePage/BasePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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

require('./dimensionForm.scss');

function Criteria(props) {

  const [evidence, setEvidence] = useState(false);
  const [typeAnswer, setTypeAnswer] = useState('');
  const { criterion, addIndicator, removeCriterion, editCriterion, indicatorsList, indexArray, removeIndicator } = props;

  function editingCriterion(value, field) {
    editCriterion(indexArray, field, value, criterion._id);
  }

  return (
    <div style={{display: 'flex'}}>
      <div className="dimension-form-card inside-row">
        <div className="dimension-form-row">
          <div style={{width: '80%'}}>
            <span>Nome</span>
            <input className="input-form" value={criterion.name} onChange={e => editingCriterion(e.target.value, "name")}/>
          </div>
          <div style={{width: '20%', marginLeft: '10px'}}>
            <span>Peso</span>
            <input className="input-form" value={criterion.weight} onChange={e => editingCriterion(e.target.value, "weight")}/>
          </div>
        </div>
        <div style={{marginTop: '10px'}}>
          <span>Descrição</span>
          <textarea className="text-container" value={criterion.description} onChange={e => editingCriterion(e.target.value, "description")}/>
        </div>
        <div className="dimension-form-row inside-card">
          <span className="dimension-form-title">Indicadores</span>
          <div className="btn-confirm new-btn" onClick={addIndicator}>Novo indicador</div>
        </div>
        {
          criterion.indicatorsList && criterion.indicatorsList.map((indicator, index) => (
            <div style={{display: 'flex'}} key={index}>
              <div className="dimension-form-card inside-row">
                <div className="dimension-form-row inside-card">
                  <div style={{width: '80%'}}>
                    <span>Nome</span>
                    <input className="input-form"/>
                  </div>
                  <div style={{width: '20%', marginLeft: '10px'}}>
                    <span>Peso</span>
                    <input className="input-form"/>
                  </div>
                </div>
                <div className="dimension-form-row inside-card">
                  <div className="input-outside">
                    <span>Refência</span>
                    <input className="input-form"/>
                  </div>
                  <div className="input-middle">
                    <span>Área</span>
                    <input className="input-form"/>
                  </div>
                  <div className="input-outside">
                    <span>Responsável</span>
                    <input className="input-form"/>
                  </div>
                </div>
                <div className="textarea-container">
                  <span>Descrição</span>
                  <textarea className="text-container"/>
                </div>
                <div className="textarea-container">
                  <span>Questão</span>
                  <textarea className="text-container"/>
                </div>
                <div className="dimension-form-row">
                  <div style={{width: '90%'}}>
                    <span>Instruções</span>
                    <textarea className="text-container"/>
                  </div>
                  <input type="checkbox" name="evidence" checked={evidence} onChange={(e) => setEvidence(!evidence)}/>
                  <span>Evidência?</span>
                </div>
                <div style={{marginTop: '10px'}}>
                  <div>
                    <span>Tipo de resposta</span>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div>
                      <input type="radio" value={'dissertative'} checked={typeAnswer==='dissertative'} onChange={(e) => setTypeAnswer(e.target.value)}/>
                      <span>Dissertativa</span>
                    </div>
                    <div style={{margin: '0px 10px'}}>
                      <input type="radio" value={'binary'} checked={typeAnswer==='binary'} onChange={(e) => setTypeAnswer(e.target.value)}/>
                      <span>Binária</span>
                    </div>
                    <div>
                      <input type="radio" value={'multiple'} checked={typeAnswer==='multiple'} onChange={(e) => setTypeAnswer(e.target.value)}/>
                      <span>Multipla escolha</span>
                    </div>
                  </div>
                </div>
              </div>
              <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={() => removeIndicator(index, indicator._id)}/>
            </div>
          ))
        }

      </div>
      <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={removeCriterion}/>
    </div>
  )
}

function DimensionForm(props) {

  const [criteriaList, setCriteriaList] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  let isEdited = useRef();
  const { id } = useParams();

  useEffect(() => {
    getInfos();
    return (async () => {
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
      for(let i = 0; i < data1.length; i++) {
        let data2 = await getAllIndicatorsCriterion(id, data1[i]._id);
        data1[i].indicatorsList = data2;
      }
      setCriteriaList(data1);
    } else {
      isEdited.current = 'no';
    }
  }

  async function addCriterion() {
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
    let data = await saveIndicatorCriterion(id, idCriterion);
    let aux = criteriaList.slice();
    let newIndicator = {
      name: '',
      "description": "",
      "reference": "",
      "weight": 0,
      "evidence": false,
      "question": {
        "title": "",
        "type": 0,
        "answer": {
          "answer": "",
          "points": 0
        }
      },
    };
    aux[idArray].indicatorsList.push({...newIndicator, ...data});
    setCriteriaList(aux);
  }

  async function removeIndicator(idCriterion, idIndicator, indArrayCrit, indArrayIndc) {
    console.log(idCriterion, idIndicator, indArrayCrit, indArrayIndc);
    await deleteIndicatorCriterion(id, idCriterion, idIndicator);
    let aux = criteriaList.slice();
    aux[indArrayCrit].indicatorsList.splice(indArrayIndc, 1);
    setCriteriaList(aux);
  }

  async function removeCriterion(idCriterion) {
    let aux = criteriaList.slice();
    await deleteCriterionDimension(id, aux[idCriterion]._id);
    aux.splice(idCriterion, 1);
    setCriteriaList(aux);
  }

  async function editCriterion(idArray, field, value, idCriterion) {
    let newobj = {[field]: value};
    let aux = criteriaList.slice();
    aux[idArray] = {...aux[idArray], ...newobj};
    setCriteriaList(aux);
    await updateCriterionDimension(id, idCriterion, newobj);
  }

  async function saveInfoDimension(field, value) {
    isEdited.current = 'yes';
    await updateDimension(id, {[field]: value});
  }

  console.log(criteriaList);

  return (
    <BasePage title={'Formulário da dimensão'}>
      <div className="dimension-form-container">
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
              <input className="input-form" value={year} onChange={(e) => setYear(e.target.value)} onBlur={() => saveInfoDimension('year', year)}/>
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
            <Criteria
              key={index}
              indexArray={index}
              criterion={criterion}
              addIndicator={() => addIndicator(criterion._id, index)}
              removeCriterion={() => removeCriterion(index)}
              editCriterion={(index, field, value, idCriterion) => editCriterion(index, field, value, idCriterion)}
              removeIndicator={(indArrayIndc, idIndicator) => removeIndicator(criterion._id, idIndicator, index, indArrayIndc)}
            />
          ))
        }
        <div className="btn-confirm save-btn" onClick={addCriterion}>Salvar</div>
      </div>
    </BasePage>
  )
}

export default DimensionForm;
