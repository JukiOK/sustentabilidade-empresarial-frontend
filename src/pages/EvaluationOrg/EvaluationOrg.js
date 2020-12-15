import React from 'react';
import Evaluation from '../Evaluation/Evaluation';

/**
* Componente para tela da avaliação de uma organização
*/

function EvaluationOrg(props) {
  return (
    <Evaluation history={props.history}/>
  )
}

export default EvaluationOrg;
