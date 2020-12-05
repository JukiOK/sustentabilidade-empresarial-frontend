import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import colorsobject from '../../constants/colorsobject';
import PropTypes from 'prop-types';

/**
* Componente para botão com animação de loading quando esta executando uma requisição.

* Exemplo:
````javascript
import SaveBtn from '../../components/SaveBtn/SaveBtn';

function Test() {
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    await request();
    setSaving(false);
  }

  return (
    <div>
      <SaveBtn saving={saving} save={save} />
    </div>
  )
}
````
*/

function SaveBtn(props) {

  const override = css`margin: auto;`; //modificando o css da componente ClipLoader
  //state que indica se a requisição esta sendo executada, então deve mostrar a animação de loading, que é a componente ClipLoader
  const [saving, setSaving] = useState(props.saving);

  useEffect(() => { //função para mudar valor de saving
    setSaving(props.saving);
  }, [props.saving])

  return (
    <div className={"btn-confirm " + props.classBtn} onClick={props.save}>
      {
        !saving &&
        <span style={{...{color: colorsobject.white}, ...props.style}}>
          Salvar
        </span>
      }
      <ClipLoader
        size={20}
        color={colorsobject.white}
        loading={saving}
        css={override}
      />
    </div>
  )
}

export default SaveBtn;

SaveBtn.propTypes = {
  /**
  * Se esta executando a requisição
  */
  saving: PropTypes.bool.isRequired,
  /**
  * className da div do botão
  */
  classBtn: PropTypes.string,
  /**
  * Modificar o estilo do texto do botão
  */
  style: PropTypes.object,
  /**
  * Função executada quando botão é pressionado, não há prametro
  */
  save: PropTypes.func.isRequired,
}
