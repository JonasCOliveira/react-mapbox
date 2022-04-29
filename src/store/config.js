export const initialState = { todos: false };

// export const camadas = { descargas: false, radar: false, satelite: false };

export function reducer(state, action) {
  switch (action.type) {
    case "LISTA_ALVOS":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
