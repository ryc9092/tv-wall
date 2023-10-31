import loadable from "@loadable/component";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import ResponsiveLayout from "./layouts/responsiveLayout";
import Sidebar from "./components/sidebar/sidebar";
import "./App.css";

const Login = loadable(() => import("./pages/Login"));
const Main = loadable(() => import("./pages/Main"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element=<Login /> />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                sidebar={<Sidebar />}
                main={<Main />}
              ></ResponsiveLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
