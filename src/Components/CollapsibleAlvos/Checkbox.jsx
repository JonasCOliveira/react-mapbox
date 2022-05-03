import React, { useState, useContext } from "react";
import DataContext from "../../data/DataContext";

export function Checkbox(props) {

  const [checked, setChecked] = useState(props.checked);
  const label = props.label;
  const context = useContext(DataContext);

  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          value={label}
          checked={props.checked}
          onChange={(event) => {
            // Atualiza estado
            if (label == "todos" && event.target.checked) {
              let layers = { ...context.alvosState };
              let alvos = {};

              Object.entries(layers).map((element) => {
                let layer = `${element[0]}`;
                alvos[[layer]] = true;
              });

              context.setAlvosState({
                ...context.alvosState,
                ...alvos,
              });

              console.log(context.alvosState);
            } else if (label == "todos" && event.target.checked == false) {
              let layers = { ...context.alvosState };
              let alvos = {};

              Object.entries(layers).map((element) => {
                let layer = `${element[0]}`;
                alvos[[layer]] = false;
              });

              context.setAlvosState({
                ...context.alvosState,
                ...alvos,
              });
            } else {
              context.setAlvosState({
                ...context.alvosState,
                [label]: event.target.checked,
              });
            }

            // Atualiza o componente
            setChecked(event.target.checked);
          }}
        />

        {label}
      </label>
    </div>
  );
}
