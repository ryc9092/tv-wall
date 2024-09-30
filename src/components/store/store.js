import React, { createContext, useReducer } from "react";
import Reducer from "./reducer";

export const clearState = {
  account: null,
  token: null,
  siderCollapse: false,
  currentRoute: null,
};

export const initialState = {
  vars: null,
  ...clearState,
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

export const StoreContext = createContext(initialState);
export default Store;
