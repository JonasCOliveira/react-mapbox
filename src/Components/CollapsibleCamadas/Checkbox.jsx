import React, { useState, useEffect, useContext, useReducer } from "react";

import { camadas, reducer } from "../../store/config";

import DataContext from "../../data/DataContext";

export function Checkbox(props) {
  //   const [state, dispatch] = useReducer(reducer, camadas);

  const [checked, setChecked] = useState(props.checked);
  const label = props.label;
  const context = useContext(DataContext);

  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          value={label}
          checked={checked}
          onChange={(event) => {
            // Atualiza estado

            // dispatch({
            //   type: "SET_STATUS_CAMADA",
            //   payload: { [label]: event.target.checked },
            // });

            context.setState({
              ...context.state,
              [label]: event.target.checked,
            });

            // Atualiza o componente
            setChecked(event.target.checked);
          }}
        />

        {label}
      </label>
    </div>
  );
}
