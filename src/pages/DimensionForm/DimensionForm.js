import React, { useState } from 'react';
import BasePage from '../BasePage/BasePage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

require('./dimensionForm.scss');

function Criteria(props) {

  const [evidence, setEvidence] = useState(false);
  const [typeAnswer, setTypeAnswer] = useState('');
  const { criteria, index, addIndicator, removeCriteria, editCriteria, } = props;

  function editingCriteria(value, field) {
    editCriteria(index, field, value);
  }

  return (
    <div style={{display: 'flex'}}>
      <div className="dimension-form-card inside-row">
        <div className="dimension-form-row">
          <input placeholder="Nome" className="input-form" value={criteria.name} onChange={e => editingCriteria(e.target.value, "name")}/>
          <input placeholder="Peso"/>
        </div>
        <textarea placeholder="Descrição" className="text-container"/>
        <div className="dimension-form-row inside-card">
          <span className="dimension-form-title">Indicadores</span>
          <div className="btn-confirm new-btn" onClick={addIndicator}>Novo indicador</div>
        </div>
        {
          props.criteria.indicatorList.map((indicator, index) => (
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
      <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={removeCriteria}/>
    </div>
  )
}

function DimensionForm(props) {

  const [criteriaList, setCriteriaList] = useState([]);

  function addCriteria() {
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

  function removeCriteria(id) {
    let aux = criteriaList.slice();
    aux.splice(id, 1);
    setCriteriaList(aux);
  }

  function editCriteria(id, field, value) {
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
            <input placeholder="Código"/>
          </div>
          <textarea placeholder="Descrição" className="text-container"/>
        </div>
        <div className="dimension-form-row">
          <span className="dimension-form-title">Critérios</span>
          <div className="btn-confirm new-btn" onClick={addCriteria}>Novo critério</div>
        </div>
        {
          criteriaList.map((criteria, index) => (
            <Criteria
              index={index}
              key={index}
              criteria={criteria}
              addIndicator={() => addIndicator(index)}
              removeCriteria={() => removeCriteria(index)}
              editCriteria={(index, field, value) => editCriteria(index, field, value)}
            />
          ))
        }
        <div className="btn-confirm save-btn" onClick={addCriteria}>Salvar</div>
      </div>
    </BasePage>
  )
}

export default DimensionForm;
