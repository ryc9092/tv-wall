import React, { useContext } from "react";
import { StoreContext } from "../components/store/store";
import { Navigate } from "react-router-dom";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children }) {
  const [store] = useContext(StoreContext);
  const isAuthenticated = store.account;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
