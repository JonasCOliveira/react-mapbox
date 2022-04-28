import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import useCollapse from "react-collapsed";

import { Checkbox } from "../CollapsibleCamadas/Checkbox";

export default function CollLayers(props) {

  const [checkbox, setCheckbox] = useState([]);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  function renderCamadas() {
    return (
      <div>
        {Object.entries(props.layers).map((element) => (
          <Checkbox key={element[0]} label={element[0]} checked={element[1]} />
        ))}
      </div>
    );
  }

  return (
    <div className="collapsible">
      <div className="header" {...getToggleProps()}>
        Camadas
      </div>
      <div {...getCollapseProps()}>
        <div className="content">{renderCamadas()}</div>
      </div>
    </div>
  );
}
