import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';

/**
* Componente para criar e editar indicador. Salva automaticamente no input onBlur.
*/

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
    //nicializando states relacionados as questões
    if(indicator.question) {
      setQuestionTitle(indicator.question.title);
      setInstruction(indicator.question.instruction);
      setTypeAnswer(indicator.question.type);

      if(indicator.question.options) {
        setAnswerList(indicator.question.options);
      }
    }
  }, [indicator]);

  function handleSave() { //função para salvar informações do indicador, chamada no onBlur dos inputs
    let body = {name, weight, evidence, reference, area, responsable, description,
      question: {
        title: questionTitle,
        instruction,
        type: typeAnswer,
        options: answerList,
      }
    }
    saveInfoIndicator(body);
  }

  function handleChangeAnwserType(value) { //função para modificar tipo das respostas
    setTypeAnswer(value);
    switch (value) {
      case 'dissertative':
        setAnswerList([]);
        break;
      case 'binary': case 'multiple':
        setAnswerList([{text:'', points: ''}, {text:'', points: ''}])
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
    aux.push({text:'', points: ''});
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
              <FontAwesomeIcon icon={faAngleUp} className="icon-arrow" onClick={() => setExpand(false)}/>
            </div>
            <div className="dimension-form-row inside-card">
              <div style={{width: '80%'}}>
                <span>Nome</span>
                <input className="input-form" value={name} onChange={e => setName(e.target.value)} onBlur={handleSave}/>
              </div>
              <div style={{width: '20%', marginLeft: '10px'}}>
                <span>Peso</span>
                <input className="input-form" type="number" placeholder="Valor entre 0 e 1" value={weight} onChange={e => setWeight(e.target.value)} onBlur={handleSave}/>
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
                      <input value={answer.text} placeholder="Insira texto da resposta" style={{width: '75%', marginRight: '10px'}}
                        onChange={e => editAnswer(index, 'text', e.target.value)}
                        onBlur={handleSave}
                      />
                      <input type="number" value={answer.points} placeholder="Insira pontuação da resposta" style={{width: '20%'}}
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
            <FontAwesomeIcon icon={faAngleDown} className="icon-arrow" onClick={() => setExpand(true)}/>
          </div>
        }

      </div>
      <FontAwesomeIcon icon={faTrashAlt} className="icon-trash" onClick={() => removeIndicator()}/>
    </div>
  )
}

export default Indicator;

Indicator.propTypes = {
  /**
  * Objeto com os indicadores
  */
  indicator: PropTypes.object.isRequired,
  /**
  * Função para remover o indicador, não passa parametro
  */
  removeIndicator: PropTypes.func.isRequired,
  /**
  * Função para salvar o indicador no banco de dados, e salva dentro do state criteriaList, passa o objeto com informações do indicador
  */
  saveInfoIndicator: PropTypes.func.isRequired,
}
