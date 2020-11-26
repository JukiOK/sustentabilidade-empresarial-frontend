import React, { useState, useEffect } from 'react';

require('./overlay.scss');

function Overlay(props) {

  const [openOverlay, setOpenOverlay] = useState(props.openOverlay);

  useEffect(() => {
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
