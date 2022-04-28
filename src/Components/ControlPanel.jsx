import React from "react";

import CollAlvos from "./CollapsibleAlvos/CollAlvos";
import CollLayers from "./CollapsibleCamadas/CollLayers";


import "../App.css";

export function ControlPanel(props) {
  return (
    <div id="console" className="control-panel">
      <CollLayers layers={props.layers} />
      <CollAlvos />

    </div>
  );
}
