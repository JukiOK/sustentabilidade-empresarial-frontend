import React from 'react';
import BasePage from '../BasePage/BasePage';
import Organizations from '../../components/Organizations/Organizations';

/**
* Componente para página de lista de organizações.
*/

function OrganizationsList(props) {
  return (
    <BasePage title={'Lista de instituições'}>
      <Organizations/>
    </BasePage>
  )
}

export default OrganizationsList;
