import React, { createContext, useReducer } from "react";
import Reducer from "./reducer";

export const clearState = {
  account: null,
  role: null,
  token: null,
  siderCollapse: false,
};

export const initialState = {
  vars: null,
  ...clearState,
};

const Store = ({ children }) => {
  let updateState = initialState;
  updateState.token = sessionStorage.getItem("token");
  updateState.account = sessionStorage.getItem("account");
  updateState.role = sessionStorage.getItem("role");
  const [state, dispatch] = useReducer(Reducer, updateState);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

export const StoreContext = createContext(initialState);
export default Store;
