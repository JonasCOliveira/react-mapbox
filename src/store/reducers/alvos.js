import { ALTERAR_ALVOS } from "../actions/actionTypes";

const initialState = {
  todos: false,
};

export default function reducer(state = initialState, action) {
  console.log("action recebida: ", action);

  switch (action.type) {
    case ALTERAR_ALVOS:
      return action.payload;

    default:
      return state;
  }
}
