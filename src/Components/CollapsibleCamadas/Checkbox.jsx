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
          checked={checked}
          onChange={(event) => {
            // Atualiza estado

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
