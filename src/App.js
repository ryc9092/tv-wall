import loadable from "@loadable/component";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import ResponsiveLayout from "./layouts/responsiveLayout";
import Sidebar from "./components/sidebar/sidebar";
import "./App.css";

const Login = loadable(() => import("./pages/Login"));
const TVWall = loadable(() => import("./pages/TVWall"));
const SingleScreen = loadable(() => import("./pages/SingleScreen"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element=<Login /> />
        <Route
          path="/tv-wall"
          element={
            <PrivateRoute>
              <ResponsiveLayout sidebar={<Sidebar />} main={<TVWall />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/single-screen"
          element={
            <PrivateRoute>
              <ResponsiveLayout sidebar={<Sidebar />} main={<SingleScreen />} />
            </PrivateRoute>
          }
        />
        <Route path="*" element=<Login /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
