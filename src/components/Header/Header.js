import React from 'react';

require('./header.scss');

function Header(props) {
  return (
    <div className="header-container">
      <span className="header-title">{props.title}</span>
    </div>
  )
}

export default Header;
