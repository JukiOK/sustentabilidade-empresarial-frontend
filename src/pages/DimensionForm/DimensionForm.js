import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {saveDimension, updateDimension, saveCriterionDimension, saveIndicatorCriterion, updateCriterionDimension, updateIndicatorCriterion} from '../../services/requests';

require('./dimensionForm.scss');

function Criteria(props) {

  const [evidence, setEvidence] = useState(false);
  const [typeAnswer, setTypeAnswer] = useState('');
  const { criterion, addIndicator, removeCriterion, editCriterion, } = props;

  function editingCriterion(value, field) {
    editCriterion(criterion._id, field, value);
  }

  return (
    <div style={{display: 'flex'}}>
      <div className="dimension-form-card inside-row">
        <div className="dimension-form-row">
          <input placeholder="Nome" className="input-form" value={criterion.name} onChange={e => editingCriterion(e.target.value, "name")}/>
          <input placeholder="Peso"/>
        </div>
        <textarea placeholder="Descrição" className="text-container"/>
        <div className="dimension-form-row inside-card">
          <span className="dimension-form-title">Indicadores</span>
          <div className="btn-confirm new-btn" onClick={addIndicator}>Novo indicador</div>
        </div>
        {
          criterion.indicatorList.map((indicator, index) => (
            <div style={{display: 'flex'}} key={index}>
              <div className="dimension-form-card inside-row">
                <div className="dimension-form-row inside-card">
                  <input placeholder="Nome" className="input-form"/>
                  <input placeholder="Peso"/>
                </div>
                <div className="dimension-form-row inside-card">
                  <input placeholder="Refência" className="input-outside"/>
                  <input placeholder="Área" className="input-middle"/>
                  <input placeholder="Responsavel" className="input-outside"/>
                </div>
                <textarea placeholder="Descrição" className="text-container"/>
                <textarea placeholder="Questão" className="text-container"/>
                <div className="dimension-form-row">
                  <textarea placeholder="Instruções" className="text-container"/>
                  <input type="checkbox" name="evidence" checked={evidence} onChange={(e) => setEvidence(!evidence)}/>
                  <span>Evidência?</span>
                </div>
                <div style={{marginTop: '10px'}}>
                  <div>
                    <span>Tipo de resposta:</span>
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
              <FontAwesomeIcon icon={faTrashAlt} className="icon-trash"/>
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
  const [year, setYear] = useState();

  function addCriterion() {
    let aux = criteriaList.slice();
    aux.push({name: '', weight: 0, indicatorList: []});
    setCriteriaList(aux);
  }

  function addIndicator(id) {
    let aux = criteriaList.slice();
    let newIndicator = {name: ''};
    aux[id].indicatorList = [...aux[id].indicatorList, newIndicator];
    setCriteriaList(aux);
  }

  function removeCriterion(id) {
    let aux = criteriaList.slice();
    aux.splice(id, 1);
    setCriteriaList(aux);
  }

  function editCriterion(id, field, value) {
    let newobj = {[field]: value};
    let aux = criteriaList.slice();
    aux[id] = {...aux[id], ...newobj};
    setCriteriaList(aux);
  }

  console.log(criteriaList);

  return (
    <BasePage title={'Formulário da dimensão'}>
      <div className="dimension-form-container">
        <span className="dimension-form-title">Informações gerais</span>
        <div className="dimension-form-card">
          <div className="dimension-form-row">
            <input placeholder="Nome" className="input-form"/>
            <input placeholder="Código" style={{marginRight: '10px'}}/>
            <input placeholder="Ano"/>
          </div>
          <textarea placeholder="Descrição" className="text-container"/>
        </div>
        <div className="dimension-form-row">
          <span className="dimension-form-title">Critérios</span>
          <div className="btn-confirm new-btn" onClick={addCriterion}>Novo critério</div>
        </div>
        {
          criteriaList.map((criterion, index) => (
            <Criteria
              key={index}
              criterion={criterion}
              addIndicator={() => addIndicator(index)}
              removeCriterion={() => removeCriterion(index)}
              editCriterion={(index, field, value) => editCriterion(index, field, value)}
            />
          ))
        }
        <div className="btn-confirm save-btn" onClick={addCriterion}>Salvar</div>
      </div>
    </BasePage>
  )
}

export default DimensionForm;
