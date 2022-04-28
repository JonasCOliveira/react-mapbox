import { ALTERAR_ALVOS } from "./actionTypes";

export function getAlvos() {
  const action = {
    type: "",
    payload: "",
  };

  return action;
}

// Action Creator
export function alterarAlvos(alvosAtivos) {
  const action = {
    type: ALTERAR_ALVOS,
    payload: alvosAtivos,
  };

  console.log("action enviada :", action);

  return action;
}
