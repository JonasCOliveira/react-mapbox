import "./App.css";

import React, { useState, useRef, useEffect } from "react";
import { Map, Source, Layer, ScaleControl, Popup } from "react-map-gl";
import * as turf from "@turf/turf";

import { ControlPanel } from "./Components/ControlPanel";
import Alvos from "./Components/Layers/Alvos";
import { Descargas } from "./Components/Layers/Descargas";
import { Satelites } from "./Components/Layers/Satelites";
import { Radares } from "./Components/Layers/Radares";

import DataContext, { camadas, alvos } from "./data/DataContext";

import { BiPause, BiPlay } from "react-icons/bi";
import { HiPencil } from "react-icons/hi";

import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const mapRef = useRef();

  // Controle do medidor de distância
  const [draw, setDraw] = useState(false);

  // Controle do popup de informações dos alvos
  const [popUpInfo, setPopupInfo] = useState({
    latlng: null,
    alvos: [],
  });

  // Controle de camadas e alvos
  const [layers, setLayers] = useState(camadas);
  const [companies, setCompanies] = useState(alvos);

  // Controle da camada de Satelite
  const [opacidade, setOpacidade] = useState(100);
  const [play, setPlay] = useState(false);
  const [imageIndex, setImageIndex] = useState(1);

  // Controle de estilo
  const [estilo, setEstilo] = useState("streets-v11");

  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0059,
    zoom: 1,
    maxZoom: 18,
    minZoom: 1,
  });

  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  // Desenha a linha entre pontos
  const linestring = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [],
    },
  };

  // Funcionalidade para centralizar a camera na latitude e longitude especificada
  const onSelectAlvo = function (longitude, latitude) {
    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
  };

  const distanceContainer = document.getElementById("distance");

  useEffect(() => {
    // Altera a imagem a ser mostrada na camada de satelite em um intervalo de 1 segundo
    if (play) {
      const timer = setInterval(() => {
        if (imageIndex < 5) setImageIndex(imageIndex + 1);
        else setImageIndex(1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [imageIndex, play]);

  return (
    <DataContext.Provider
      value={{
        state: layers,
        setState: setLayers,
        alvosState: companies,
        setAlvosState: setCompanies,
      }}
    >
      <div className="App">
        {/* Alternar entre modos de desenho e mouse */}

        <div className="measure-distance">
          <div id="" className={`draw ${draw ? "active" : ""} `}>
            <HiPencil
              onClick={() => {
                setDraw(!draw);
              }}
            />
          </div>

          <div>
            Distância:
            <div id="distance"></div>
          </div>
        </div>

        <div id="latlng" className="latLng"></div>

        <div className={`map-overlay top {${layers.satelite ? "active" : ""}`}>
          <div className="map-overlay-inner">
            <label>
              Opacidade: <span id="slider-value">{opacidade}%</span>
            </label>
            <input
              id="slider"
              type="range"
              min="0"
              max="100"
              step="0"
              value={opacidade}
              onChange={(e) => {
                setOpacidade(+e.target.value);
              }}
            />

            <div>
              <span>
                {play ? (
                  <BiPause onClick={() => setPlay(!play)} />
                ) : (
                  <BiPlay onClick={() => setPlay(!play)} />
                )}
              </span>
              <input
                className="player"
                id="slider"
                type="range"
                min="0"
                max="5"
                step="1"
                value={imageIndex}
                onChange={(e) => {
                  setImageIndex(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className={"radio-button-group"}>
          <div className="map-overlay-inner">
            <label>Escolha o estilo:</label>
            <div onChange={(e) => setEstilo(e.target.value)}>
              <input
                type="radio"
                value="satellite-streets-v11"
                name="style"
                checked={estilo === "satellite-streets-v11"}
              />{" "}
              Street Satelite
              <input
                type="radio"
                value="streets-v11"
                name="style"
                checked={estilo === "streets-v11"}
              />{" "}
              Ligth
              <input
                type="radio"
                value="dark-v10"
                name="style"
                checked={estilo === "dark-v10"}
              />{" "}
              Dark
            </div>
          </div>
        </div>

        <Map
          {...viewport}
          ref={mapRef}
          style={{ width: "100vw", height: "100vh" }}
          mapStyle={`mapbox://styles/mapbox/${estilo}`}
          mapboxAccessToken="pk.eyJ1Ijoiam9uYXNjYXVhbiIsImEiOiJjbDEzeDZyb2swMmJqM2JvdzZqeTBvNXoyIn0.q-ES58Q2Jlds_5LSa_EavA"
          maxBounds={[
            [-122, -52],
            [-18, 12],
          ]}
          onLoad={() => {
            // set interactive layers id
            const alvosArrLayers = [];
            mapRef.current.getStyle().layers.map((element) => {
              if (element.id.startsWith("tb_")) alvosArrLayers.push(element);
            });
            mapRef.current.interactiveLayerIds = alvosArrLayers;
          }}
          onMove={(event) => {
            setViewport(event.target.viewport);
            const features = mapRef.current.queryRenderedFeatures(event.point, {
              layers: ["measure-points"],
            });

            // Muda o estilo do cursor
            mapRef.current.getCanvas().style.cursor = features.length
              ? "pointer"
              : "crosshair";
          }}
          onMouseMove={(event) => {
            document.getElementById("latlng").innerHTML =
              "Latitude: " +
              JSON.stringify(event.lngLat.wrap().lat) +
              "<br>" +
              "Longitude: " +
              JSON.stringify(event.lngLat.wrap().lng);
          }}
          onClick={(event) => {
            if (draw) {
              const features = mapRef.current.queryRenderedFeatures(
                event.point,
                {
                  layers: ["measure-points"],
                }
              );

              if (geojson.features.length > 1) geojson.features.pop();

              // Limpa o valor de distância no container para atribuir um novo
              distanceContainer.innerHTML = "";

              if (features.length) {
                const id = features[0].properties.id;
                geojson.features = geojson.features.filter(
                  (point) => point.properties.id !== id
                );
              } else {
                const point = {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [event.lngLat.lng, event.lngLat.lat],
                  },
                  properties: {
                    id: String(new Date().getTime()),
                  },
                };

                geojson.features.push(point);
              }

              if (geojson.features.length > 1) {
                linestring.geometry.coordinates = geojson.features.map(
                  (point) => point.geometry.coordinates
                );

                geojson.features.push(linestring);

                // Popula o container de distância com o valor total
                const value = document.createElement("pre");
                const distance = turf.length(linestring);
                value.textContent = `${distance.toLocaleString()} km`;
                distanceContainer.appendChild(value);
              }

              mapRef.current.getSource("geojson").setData(geojson);
            } else {
              let interactiveLayers = [];
              mapRef.current.interactiveLayerIds.map((element) =>
                interactiveLayers.push(element.id)
              );

              // Area de captura de alvos
              const area = [
                [event.point.x - 50, event.point.y - 50],
                [event.point.x + 50, event.point.y + 50],
              ];

              const features = mapRef.current.queryRenderedFeatures(
                // Caso não queira definir uma área, utilizar event.point,
                area,
                {
                  layers: interactiveLayers,
                }
              );

              features.map((element) => {
                if (element.properties.buffer == "0") {
                  setPopupInfo({
                    ...popUpInfo,
                    alvos: [element.properties],
                  });
                }
              });

              setPopupInfo({ ...popUpInfo, latlng: event.lngLat });
            }
          }}
        >
          <Source id="geojson" type="geojson" data={geojson}>
            <Layer
              id="measure-points"
              type="circle"
              source="geojson"
              paint={{
                "circle-radius": 5,
                "circle-color": "#000",
              }}
              filter={["in", "$type", "Point"]}
            />

            <Layer
              id="measure-lines"
              type="line"
              source="geojson"
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
              paint={{
                "line-color": "#000",
                "line-width": 2.5,
              }}
              filter={["in", "$type", "LineString"]}
            />
          </Source>

          {/* Layer dos alvos */}
          <Alvos />

          {/* Layer de descargas GOES */}
          <Descargas />

          <Satelites opacidade={opacidade} imageIndex={imageIndex} />

          {popUpInfo.latlng && (
            <Popup
              anchor="top"
              longitude={Number(popUpInfo.latlng.lng)}
              latitude={Number(popUpInfo.latlng.lat)}
              onClose={() => setPopupInfo({ latlng: null, alvos: [] })}
            >
              {/* Utilizar um map para mostrar as informações de todos os alvos dentro da variável popupInfo */}
              <div>Informações</div>
            </Popup>
          )}

          <ScaleControl />
        </Map>

        <ControlPanel layers={layers} />
      </div>
    </DataContext.Provider>
  );
}

export default App;
