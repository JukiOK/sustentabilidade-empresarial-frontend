import React, { useState, useEffect } from 'react';
import BasePage from '../BasePage/BasePage';
import { getTerms, setTerms } from '../../services/requests';

require('./privacyPolice.scss');

function PrivacyPolice(props) {

  const [link, setLink] = useState('');

  useEffect(() => {
    getTerms().then(data => {
      setLink(data.url)
    })
  }, []);

  function saveLink() {
    setTerms(link).then(() => {
      alert('O link foi enviado com sucesso');
    })
  }

  return (
    <BasePage title={'Editar Política de privacidade'}>
      <div className="privacy-police-container">
        <span>Digite o link do arquivo com a política de privacidade.</span>
        <div style={{display: 'flex', marginTop: '10px'}}>
          <input value={link} onChange={e => setLink(e.target.value)}/>
          <button onClick={saveLink} className="btn-confirm">Enviar</button>
        </div>
      </div>
    </BasePage>
  )
}

export default PrivacyPolice;
