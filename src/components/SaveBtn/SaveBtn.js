import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import colorsobject from '../../constants/colorsobject';

function SaveBtn(props) {

  const override = css`margin: auto;`;
  const [saving, setSaving] = useState(props.saving);

  useEffect(() => {
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
