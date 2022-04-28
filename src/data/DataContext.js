import React from "react";

export const camadas = {
  descargas: false,
  radar: false,
  satelite: false,
};

export const alvos = {};

const DataContext = React.createContext(camadas, alvos);

export default DataContext;
