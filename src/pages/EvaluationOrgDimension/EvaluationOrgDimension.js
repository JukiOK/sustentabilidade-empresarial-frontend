import React from 'react';
import FormEvaluation from '../FormEvaluation/FormEvaluation';

/**
* Componente para página da avaliação da dimensão de uma organização
*/

function EvaluationOrgDimension(props) {
  return (
    <FormEvaluation history={props.history} backBtn/>
  )
}

export default EvaluationOrgDimension;
