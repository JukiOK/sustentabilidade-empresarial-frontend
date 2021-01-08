import React, { useState } from 'react';
import BasePage from '../BasePage/BasePage';

require('./privacyPolice.scss');

function PrivacyPolice(props) {

  const [link, setLink] = useState('');
  return (
    <BasePage title={'Editar Política de privacidade'}>
      <div className="privacy-police-container">
        <span>Digite o link do arquivo com a política de privacidade.</span>
        <div style={{display: 'flex', marginTop: '10px'}}>
          <input value={link} onChange={e => setLink(e.target.value)}/>
          <button className="btn-confirm">Enviar</button>
        </div>
      </div>
    </BasePage>
  )
}

export default PrivacyPolice;
