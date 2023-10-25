import React, { useContext, useEffect } from "react";
import { Actions } from "../store/reducer";
import { StoreContext } from "../store/store";

export const loadVarsJson = async () => {
  const response = await fetch(`/vars.json`);
  const varsJson = await response.json();
  return varsJson;
};

const VarsProvider = ({ children }) => {
  const [store, dispatch] = useContext(StoreContext);

  // load vars.json
  useEffect(() => {
    (async () => {
      let config = await loadVarsJson();
      dispatch({ type: Actions.SetVars, payload: config });
    })();
  }, []);

  return <div>{children}</div>;
};

export default VarsProvider;
