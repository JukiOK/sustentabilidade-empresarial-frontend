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

require('./dimensionForm.scss');

function Indicator(props) {

  const { indicator, removeIndicator, saveInfoIndicator } = props;
  const [evidence, setEvidence] = useState(indicator.evidence);
  const [name, setName] = useState(indicator.name);
  const [weight, setWeight] = useState(indicator.weight);
  const [reference, setReference] = useState(indicator.reference);
  const [area, setArea] = useState(indicator.area);
  const [responsable, setResponsable] = useState(indicator.responsable);
  const [description, setDescription] = useState(indicator.description);
  const [questionTitle, setQuestionTitle] =  useState('');
  const [instruction, setInstruction] = useState('');
  const [typeAnswer, setTypeAnswer] = useState('');
  const [answerList, setAnswerList] = useState([]);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if(indicator.question) {
      setQuestionTitle(indicator.question.title);
      setInstruction(indicator.question.instruction);
      setTypeAnswer(indicator.question.type);

      if(indicator.question.answer) {
        setAnswerList(indicator.question.answer);
      }
    }
  }, [indicator]);

  function handleSave() {
    let body = {name, weight, evidence, reference, area, responsable, description,
      question: {
        title: questionTitle,
        instruction,
        type: typeAnswer,
        answer: answerList,
      }
    }
    saveInfoIndicator(body);
  }

  function handleChangeAnwserType(value) {
    setTypeAnswer(value);
    switch (value) {
      case 'dissertative':
        setAnswerList([]);
        break;
      case 'binary': case 'multiple':
        setAnswerList([{answer:'', points: ''}, {answer:'', points: ''}])
      default:
        break;
    }
  }

  function editAnswer(ind, field, value) {
    let aux = answerList.slice();
    aux[ind][field] = value;
    setAnswerList(aux);
  }

  function addAnswer() {
    let aux = answerList.slice();
    aux.push({answer:'', points: ''});
    setAnswerList(aux);

  }

  function removeAnswer(index) {
    let aux = answerList.slice();
    aux.splice(index, 1);
    setAnswerList(aux);
  }

  return (
    <div style={{display: 'flex'}}>
      <div className="dimension-form-card inside-row">
        {
          expand ?
          <div>
            <div style={{display: 'flex'}}>
              <FontAwesomeIcon icon={faAngleDown} className="icon-arrow" onClick={() => setExpand(false)}/>
            </div>
            <div className="dimension-form-row inside-card">
              <div style={{width: '80%'}}>
                <span>Nome</span>
                <input className="input-form" value={name} onChange={e => setName(e.target.value)} onBlur={handleSave}/>
              </div>
              <div style={{width: '20%', marginLeft: '10px'}}>
                <span>Peso</span>
                <input className="input-form" placeholder="Valor entre 0 e 1" value={weight} onChange={e => setWeight(e.target.value)} onBlur={handleSave}/>
              </div>
            </div>
            <div className="dimension-form-row inside-card">
              <div className="input-outside" style={{width: '100%'}}>
                <span>Refência</span>
                <input className="input-form" value={reference} onChange={e => setReference(e.target.value)} onBlur={handleSave}/>
              </div>
              {/* <div className="input-middle">
                <span>Área</span>
                <input className="input-form" value={area} onChange={e => setArea(e.target.value)} onBlur={handleSave}/>
              </div>
              <div className="input-outside">
                <span>Responsável</span>
                <input className="input-form" value={responsable} onChange={e => setResponsable(e.target.value)} onBlur={handleSave}/>
              </div> */}
            </div>
            <div className="dimension-form-row">
              <div className="textarea-container" style={{width: '90%'}}>
                <span>Descrição</span>
                <textarea className="text-container" value={description} onChange={e => setDescription(e.target.value)} onBlur={handleSave}/>
              </div>
              <input type="checkbox" name="evidence" checked={evidence} onChange={(e) => setEvidence(!evidence)} onBlur={handleSave}/>
              <span>Evidência?</span>
            </div>
            <div className="textarea-container">
              <span>Questão</span>
              <textarea className="text-container" value={questionTitle} onChange={e => setQuestionTitle(e.target.value)} onBlur={handleSave}/>
            </div>
            <div style={{width: '100%'}}>
              <span>Instruções</span>
              <textarea className="text-container" value={instruction} onChange={e => setInstruction(e.target.value)} onBlur={handleSave}/>
            </div>
            <div style={{marginTop: '10px'}}>
              <div>
                <span>Tipo de resposta</span>
              </div>
              <div style={{display: 'flex'}}>
                <div>
                  <input type="radio" value={'dissertative'} checked={typeAnswer==='dissertative'} onChange={(e) => handleChangeAnwserType(e.target.value)} onBlur={handleSave}/>
                  <span>Dissertativa</span>
                </div>
                <div style={{margin: '0px 10px'}}>
                  <input type="radio" value={'binary'} checked={typeAnswer==='binary'} onChange={(e) => handleChangeAnwserType(e.target.value)} onBlur={handleSave}/>
                  <span>Binária</span>
                </div>
                <div>
                  <input type="radio" value={'multiple'} checked={typeAnswer==='multiple'} onChange={(e) => handleChangeAnwserType(e.target.value)} onBlur={handleSave}/>
                  <span>Multipla escolha</span>
                </div>
              </div>
              {
                answerList.length > 0 &&
                <div style={{margin: '10px 0px', display: 'flex'}}>
                  <span>Alternativas</span>
                  <div className="btn-confirm new-btn" onClick={addAnswer}>Nova alternativa</div>
                </div>
              }
              {
                answerList.map((answer, index) => {
                  return (
                    <div style={{margin: '10px 0px', display: 'flex', alignItems: 'center'}} key={index}>
                      <input value={answer.answer} placeholder="Insira texto da resposta" style={{width: '75%', marginRight: '10px'}}
                        onChange={e => editAnswer(index, 'answer', e.target.value)}
                        onBlur={handleSave}
                      />
                      <input value={answer.points} placeholder="Insira pontuação da resposta" style={{width: '20%'}}
                        onChange={e => editAnswer(index, 'points', e.target.value)}
                        onBlur={handleSave}
                      />
                      <div style={{width: '5%'}}>
                        {
                          index > 1 &&
                          <FontAwesomeIcon icon={faTimesCircle} className="icon-trash" style={{marginTop: '0px'}} onClick={() => removeAnswer(index)}/>
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          :
          <div style={{display: 'flex'}}>
            <span>{name}</span>
            <FontAwesomeIcon icon={faAngleUp} className="icon-arrow" onClick={() => setExpand(true)}/>
          </div>
        }

      </div>
      <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={() => removeIndicator()}/>
    </div>
  )
}

function Criteria(props) {

  const { criterion, addIndicator, removeCriterion, editCriterion,
    indicatorsList, indexArray, removeIndicator, saveInfoCriterion, saveInfoIndicator } = props;

  function editingCriterion(value, field) {
    editCriterion(indexArray, field, value, criterion._id);
  }

  return (
    <div style={{display: 'flex'}}>
      <div className="dimension-form-card inside-row ">
        <div className="dimension-form-row">
          <div style={{width: '80%'}}>
            <span>Nome</span>
            <input className="input-form" value={criterion.name} onChange={e => editingCriterion(e.target.value, "name")} onBlur={() => saveInfoCriterion()}/>
          </div>
          <div style={{width: '20%', marginLeft: '10px'}}>
            <span>Peso</span>
            <input className="input-form" placeholder="Valor entre 0 e 1" value={criterion.weight} onChange={e => editingCriterion(e.target.value, "weight")} onBlur={() => saveInfoCriterion()}/>
          </div>
        </div>
        <div style={{marginTop: '10px'}}>
          <span>Descrição</span>
          <textarea className="text-container" value={criterion.description} onChange={e => editingCriterion(e.target.value, "description")} onBlur={() => saveInfoCriterion()}/>
        </div>
        <div className="dimension-form-row inside-card">
          <span className="dimension-form-title">Indicadores</span>

        </div>
        {
          criterion.indicatorsList && criterion.indicatorsList.map((indicator, index) => (
            <Indicator
              indicator={indicator}
              key={index}
              removeIndicator={() => removeIndicator(index)}
              saveInfoIndicator={(body) => saveInfoIndicator(index, body)}
            />
          ))
        }
        <div className="btn-confirm new-btn" onClick={addIndicator}>Novo indicador</div>
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
  const [warning, setWarning] = useState(true);
  const [saving, setSaving] = useState(false);

  let isEdited = useRef();
  const { id } = useParams();

  useEffect(() => {
    getInfos();
    return (async () => {
      if(isEdited.current === 'no') {
        await deleteDimension(id);
        setTimeout(() => {}, 200);
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
    let aux = criteriaList.slice();
    let indicator = aux[indArrayCrit].indicatorsList[indArrayIndc];
    await deleteIndicatorCriterion(id, indicator.criteriaId, indicator._id);
    aux[indArrayCrit].indicatorsList.splice(indArrayIndc, 1);
    setCriteriaList(aux);
  }

  async function removeCriterion(idCriterion) {
    let aux = criteriaList.slice();
    await deleteCriterionDimension(id, aux[idCriterion]._id);
    aux.splice(idCriterion, 1);
    setCriteriaList(aux);
  }

  function editCriterion(idArray, field, value, idCriterion) {
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
    isEdited.current = 'yes';
    await updateDimension(id, {[field]: value});
  }

  async function saveInfoCriterion(idArray) {
    let criterion = criteriaList[idArray];
    setSaving(true);
    updateCriterionDimension(id, criterion._id, criterion)
    .then(() => {
      setTimeout(() => {setSaving(false)}, 500);
    });
  }

  async function saveInfoIndicator(indArrayCrit, indArrayIndc, body) {
    let indicator = criteriaList[indArrayCrit].indicatorsList[indArrayIndc];
    let list = criteriaList[indArrayCrit].indicatorsList.slice();
    list[indArrayIndc] = {...indicator, ...body};
    let listCriteria = criteriaList.slice();
    listCriteria[indArrayCrit].indicatorsList = list;
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
