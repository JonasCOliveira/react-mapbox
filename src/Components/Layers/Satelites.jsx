import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../data/DataContext";

import { Source, Layer } from "react-map-gl";

import axios from "axios";

export function Satelites(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Array de imagens
  const [imagePath, setImagePath] = useState([]);

  // Utilizar apenas uma variável do tipo object
  const [latMax, setLatMax] = useState(null);
  const [latMin, setLatMin] = useState(null);
  const [lonMax, setLonMax] = useState(null);
  const [lonMin, setLonMin] = useState(null);

  const context = useContext(DataContext);
  const visibility = context.state.satelite;

  // Esses valores podem ser fixos, independem de uma resposta de API
  function getCoordinates() {
    return new Promise((resolve) => {
      axios
        .get("http://localhost:3002/api/radares")
        .then((response) => {
          resolve(response);
        })
        .catch(() => {
          setError(true);
        });
    });
  }

  // Retorna o array com as URL's do bucket para as imagens
  function getImages() {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3002/api/goes")
        .then((response) => {
          resolve(response);
        })
        .catch(() => {
          setError(true);
        });
    });
  }

  useEffect(() => {
    Promise.all([getImages(), getCoordinates()]).then((response) => {
      setImagePath(response[0].data);

      setLatMax(parseFloat(response[1].data.data.lat_lon.lat_max));
      setLatMin(parseFloat(response[1].data.data.lat_lon.lat_min));
      setLonMax(parseFloat(response[1].data.data.lat_lon.lon_max));
      setLonMin(parseFloat(response[1].data.data.lat_lon.lon_min));

      setLoading(false);
      setError(false);
    });
  }, [loading]);

  function renderSource() {
    if (loading || error) {
      return <></>;
    } else {
      return (
        <Source
          id="satelite"
          type="image"
          // Substituir essa URL pela URL contida no array ImagePath
          // junto com o indice vindo do componente pai (App.js)
          url="https://goes-glm-images.s3.us-east-2.amazonaws.com/0220428190000.png"
          coordinates={[
            // Este é o formato correto, não alterar
            [lonMin, latMax],
            [lonMax, latMax],
            [lonMax, latMin],
            [lonMin, latMin],
          ]}
        >
          <Layer
            id="goes"
            source={"satelite"}
            type="raster"
            paint={{
              "raster-fade-duration": 0,
              "raster-opacity": parseInt(props.opacidade, 10) / 100,
            }}
            layout={{
              visibility: visibility ? "visible" : "none",
            }}
          />
        </Source>
      );
    }
  }

  return <>{renderSource()}</>;
}
