import React from "react";

export const camadas = {
  descargas: false,
  radar: false,
  satelite: false,
};

export const alvos = {
  todos: false,
};

const DataContext = React.createContext(camadas, alvos);

export default DataContext;
