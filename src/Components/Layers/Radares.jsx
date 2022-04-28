import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../data/DataContext";

import { Source, Layer } from "react-map-gl";

import axios from "axios";

export function Radares() {
  const context = useContext(DataContext);
  const visibility = context.state.radares;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [imagePath, setImagePath] = useState();

  const [latMax, setLatMax] = useState(null);
  const [latMin, setLatMin] = useState(null);
  const [lonMax, setLonMax] = useState(null);
  const [lonMin, setLonMin] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);

  const frameCount = 5;

  async function getCoordinates() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          "https://api-redemet.decea.mil.br/produtos/satelite/realcada?api_key=qSxpX00zVJZW4eGf35aMNlthpee5ROuPFiJsDiwg&data=2020032114",
          {
            method: "GET",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "content-type": "aplication/json",
            },
          }
        )
        .then((response) => {
          resolve(response);
        })

        .catch(() => {
          setError(true);
          setLoading(false);
        });
    });
  }

  function getImages() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          "https://api-redemet.decea.mil.br/produtos/satelite/realcada?api_key=qSxpX00zVJZW4eGf35aMNlthpee5ROuPFiJsDiwg&data=2020032114",
          {
            method: "GET",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "content-type": "aplication/json",
            },
          }
        )
        .then((response) => {
          resolve(response);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    });
  }

  useEffect(() => {
    // const intervalId = setInterval(() => {
    Promise.all([getImages(), getCoordinates()])
      .then((response) => {
        setImagePath(response[0].data.data.satelite[0].path);
        setLatMax(parseFloat(response[1].data.data.lat_lon.lat_max));
        setLatMin(parseFloat(response[1].data.data.lat_lon.lat_min));
        setLonMax(parseFloat(response[1].data.data.lat_lon.lon_max));
        setLonMin(parseFloat(response[1].data.data.lat_lon.lon_min));

        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });

    // }, 200);
    // return () => clearInterval(intervalId);
  }, [visibility]);

  function renderSource() {
    if (loading || error) {
      return <></>;
    } else {
      return (
        <Source
          id="radares"
          type="image"
          url={
            // "https://estatico-redemet.decea.mil.br/satelite/2020/03/21/realcada/maps/realcada_202003211450.png"
            imagePath
          }
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
            }}
            layout={{ visibility: visibility ? "visible" : "none" }}
          />
        </Source>
      );
    }
  }

  return <>{renderSource()}</>;
}
