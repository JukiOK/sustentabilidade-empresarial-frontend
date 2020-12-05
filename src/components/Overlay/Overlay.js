import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
require('./overlay.scss');

/**
* Componente que exibe um overlay em toda a página, e exibe container para colocar informações a serem mostradas.
*/

function Overlay(props) {

  const [openOverlay, setOpenOverlay] = useState(props.openOverlay);

  useEffect(() => { //função para abrir ou fechar o overlay
    setOpenOverlay(props.openOverlay)
  }, [props.openOverlay])

  if(openOverlay) {
    return (
      <div className="overlay-container" onClick={() => props.setOpenOverlay(false)}>
        <div className="overlay-content" onClick={e => e.stopPropagation()}>
          {props.children}
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default Overlay;

Overlay.propTypes = {
  /**
  * Overlay aberto ou fechado
  */
  openOverlay: PropTypes.bool.isRequired,
  /**
  * Função para atribuir valor para openOverlay, recebe como argumento o valor do openOverlay
  */
  setOpenOverlay: PropTypes.func.isRequired,
}
