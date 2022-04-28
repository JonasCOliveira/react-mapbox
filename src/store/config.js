export const initialState = { todos: false };

// export const camadas = { descargas: false, radar: false, satelite: false };

export function reducer(state, action) {
  switch (action.type) {
    case "LISTA_ALVOS":
      return { ...state, ...action.payload };

    case "SET_STATUS_ALVO":
      let status = { ...state, ...action.payload };
      console.log(status);
      return status;

    // case "SET_STATUS_CAMADA":
    //   return { ...state, ...action.payload };

    default:
      return state;
  }
}
