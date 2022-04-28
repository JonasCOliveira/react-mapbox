import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../data/DataContext";

import { Source, Layer } from "react-map-gl";

import axios from "axios";

export function Satelites(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [imagePath, setImagePath] = useState("");

  const [latMax, setLatMax] = useState(null);
  const [latMin, setLatMin] = useState(null);
  const [lonMax, setLonMax] = useState(null);
  const [lonMin, setLonMin] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);
  const frameCount = 5;

  const context = useContext(DataContext);
  const visibility = context.state.satelite;

  function getCoordinates() {
    console.log("get coordinates");
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3002/api/radares", {
          headers: {
            // "Access-Control-Allow-Origin": "*",
            // "content-type": "aplication/json",
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch(() => {
          setError(true);
        });
    });
  }

  function getImages() {
    console.log("get images");

    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3002/api/radares", {
          headers: {
            // "Access-Control-Allow-Origin": "*",
            // "content-type": "aplication/json",
          },
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch(() => {
          setError(true);
        });
    });
  }

  useEffect(() => {
    console.log(props);

    Promise.all([getImages(), getCoordinates()]).then((response) => {
      setImagePath(response[0].data.data.satelite[0].path);

      setLatMax(parseFloat(response[1].data.data.lat_lon.lat_max));
      setLatMin(parseFloat(response[1].data.data.lat_lon.lat_min));
      setLonMax(parseFloat(response[1].data.data.lat_lon.lon_max));
      setLonMin(parseFloat(response[1].data.data.lat_lon.lon_min));

      setLoading(false);
      setError(false);
    });

    console.log(latMin, latMax, lonMin, lonMax);
  }, [loading]);

  function renderSource() {
    if (loading || error) {
      return <></>;
    } else {
      return (
        <Source
          id="radares"
          type="image"
          // url={imagePath}
          url={`https://docs.mapbox.com/mapbox-gl-js/assets/radar${props.imageIndex}.gif`}
          coordinates={[
            // Formato correto
            [lonMin, latMax],
            [lonMax, latMax],
            [lonMax, latMin],
            [lonMin, latMin],
          ]}
        >
          <Layer
            id="radar"
            source={"radares"}
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
