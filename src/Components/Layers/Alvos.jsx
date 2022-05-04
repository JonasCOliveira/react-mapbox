import React, { useContext, useEffect, useState, useReducer } from "react";
import axios from "axios";
import { Source, Layer } from "react-map-gl";

import { initialState, reducer } from "../../store/config";

import DataContext from "../../data/DataContext";

export default function Alvos(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [layers, setLayers] = useState([]);

  const context = useContext(DataContext);

  const fetchAlvos = async () => {
    var arr = [];
    try {
      var alvosResponse = await axios
        .get("http://localhost:3002/api/alvos")
        .catch(() => {
          setError(true);
          setLoading(false);
        });
      const data = alvosResponse.data;

      Promise.all(
        data.features.map(async (element) => {
          let sourceData = { type: "FeatureCollection", features: [element] };

          if (state.hasOwnProperty(element.properties.nome.split(" - ")[0])) {
            arr.push(
              <Source
                id={element.id}
                type="geojson"
                data={sourceData}
                key={element.id}
              >
                <Layer
                  id={element.id}
                  key={element.id}
                  source={element.id}
                  type="line"
                  layout={{
                    visibility: context.alvosState[
                      element.properties.nome.split(" - ")[0]
                    ]
                      ? "visible"
                      : "none",
                  }}
                  paint={{
                    "line-color": [
                      "match",
                      ["get", "buffer"],
                      "0",
                      "#fbb03b",
                      "1",
                      "#223b53",
                      "4",
                      "#e55e5e",
                      "10",
                      "#e55e5e",
                      "20",
                      "#3bb2d0",
                      "#ccc",
                    ],
                    "line-width": 4,
                  }}
                />
              </Source>
            );
          }
        })
      ).then(() => {
        setLayers(arr);
        setLoading(false);
      });
    } catch (_) {}
  };

  useEffect(() => {
    fetchAlvos();
  }, [loading, context.alvosState]);

  function renderAlvos() {
    if (error) {
      return (
        <div className="error">
          <p>Algo deu errado! ...</p>{" "}
        </div>
      );
    } else if (loading) {
      return <div className="loader"> </div>;
    } else {
      return (
        <>
          {layers.map((element) => {
            return <div key={element.id}>{element}</div>;
          })}
        </>
      );
    }
  }

  return <>{renderAlvos()}</>;
}

