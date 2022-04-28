import React, { useEffect, useState, useContext } from "react";
import { Source, Layer } from "react-map-gl";

import axios from "axios";

import DataContext from "../../data/DataContext";

export function Descargas(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const context = useContext(DataContext);
  
  const visibility = context.state.descargas;

  const fetchDescargas = async () => {
    var arr = [];
    try {
      var descargasResponse = await axios
        .get("http://localhost:3002/api/descargas")
        .catch(() => {
          setError(true);
          setLoading(false);
        });
      const data = descargasResponse.data;
    } catch (_) {}
  };

  useEffect(() => {
    fetchDescargas();


  }, [loading]);
  return (
    <Source
      id="descargas"
      type="geojson"
      data="http://localhost:3002/api/descargas"
    >
      <Layer
        id="descargas"
        source="descargas"
        type="circle"
        layout={{
          visibility: visibility ? "visible" : "none",
        }}
        paint={{
          "circle-color": "#4264fb",
          "circle-radius": 2,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#4264fb",
        }}
      />
    </Source>
  );
}
