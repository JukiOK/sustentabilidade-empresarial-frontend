import React from 'react';
import Indicator from './Indicator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

/**
* Componente para critério no formulário de criar/editar dimensão, com informações salvas automaticamente.
*/

function Criteria(props) {

  const { criterion, addIndicator, removeCriterion, editCriterion,
     indexArray, removeIndicator, saveInfoCriterion, saveInfoIndicator } = props;

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
            <input className="input-form" type="number" placeholder="Valor entre 0 e 1" value={criterion.weight} onChange={e => editingCriterion(e.target.value, "weight")} onBlur={() => saveInfoCriterion()}/>
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

export default Criteria;

Criteria.propTypes ={
  /**
  * Informações do critério
  */
  criterion: PropTypes.object.isRequired,
  /**
  * Função para adicionar indicador dentro do critério, não passa parametro
  */
  addIndicator: PropTypes.func.isRequired,
  /**
  * Função para remover critério, não passa parametro
  */
  removeCriterion: PropTypes.func.isRequired,
  /**
  * Função para editar critério, passa como parametros indice do critério no vetor de critérios, campo, valor, e id do criterio
  */
  editCriterion: PropTypes.func.isRequired,
  /**
  * Indice do critério dentro do vetor de critérios
  */
  indexArray: PropTypes.number.isRequired,
  /**
  * Função para remover o indicador, passa o paramtro indice do indicador dentro do vetor de indicadores
  */
  removeIndicator: PropTypes.func.isRequired,
  /**
  * Função para salvar informações do critério, não passa parâmetro
  */
  saveInfoCriterion: PropTypes.func.isRequired,
  /**
  * Função para salvar informações dos indicadores, passa os parametros indice do indicador e objeto do indicador
  */
  saveInfoIndicator: PropTypes.func.isRequired,
}
