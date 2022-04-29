import axios from "axios";
import React, { useState, useEffect, useReducer, useContext } from "react";
import useCollapse from "react-collapsed";

import { Checkbox } from "./Checkbox";

import { initialState, reducer } from "../../store/config";

import DataContext from "../../data/DataContext";

import "./ColAlvos.css";

export default function CollAlvos(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  const [checkbox, setCheckbox] = useState([]);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  const context = useContext(DataContext);

  useEffect(() => {
    async function fetchAlvos() {
      let alvos = initialState;
      const response = await axios.get(`http://localhost:3002/api/lista-alvos`);

      response.data.map((element) => {
        alvos[[element]] = false;
      });

      dispatch({
        type: "LISTA_ALVOS",
        payload: alvos,
      });

      context.setAlvosState({
        ...alvos,
      });

      setLoading(false);

      console.log(context.alvosState);
    }

    fetchAlvos();
  }, [loading]);

  useEffect(() => {
    async function updateAlvos() {
      let len = 0;

      Object.entries(context.alvosState).map((element) => {
        if (element[1]) {
          len++;
        }
      });

      if (
        Object.keys(context.alvosState).length - 1 == len &&
        context.alvosState["todos"] == false
      ) {
        context.setAlvosState({
          ...context.alvosState,
          todos: true,
        });
      }

      if (
        context.alvosState["todos"] == true &&
        Object.keys(context.alvosState).length != len
      ) {
        context.setAlvosState({
          ...context.alvosState,
          todos: false,
        });
      }
    }

    updateAlvos().then(() => {
      renderAlvos();
    });
  }, [context.alvosState]);

  function renderAlvos() {
    if (loading) return <div>Carregando...</div>;
    else {
      return (
        <ul className="col-alvos">
          {Object.entries(context.alvosState).map((element) => {
            return (
              // <li>
                <Checkbox className="checkbox"
                  key={element[0]}
                  label={element[0]}
                  checked={element[1]}
                />
              // </li>
            );
          })}
        </ul>
      );
    }
  }

  return (
    <div className="collapsible">
      <div className="header" {...getToggleProps()}>
        Alvos
      </div>
      <div {...getCollapseProps()}>
        <div className="content">{renderAlvos()}</div>
      </div>
    </div>
  );
}
