import React, { useContext } from "react";
import { StoreContext } from "../components/store/store";
import { Actions } from "../components/store/reducer";
import { Navigate, useLocation } from "react-router-dom";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children }) {
  const [store, dispatch] = useContext(StoreContext);
  const isAuthenticated = store.account;
  const route = useLocation().pathname;
  if (store.currentRoute !== route)
    dispatch({ type: Actions.SetCurrentRoute, payload: route });
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
