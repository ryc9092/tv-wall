import loadable from "@loadable/component";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import ResponsiveLayout from "./layouts/responsiveLayout";
import Topbar from "./components/topbar/topbar";
import Sidebar from "./components/sidebar/sidebar";
import "./App.css";

const Login = loadable(() => import("./pages/Login"));
const Status = loadable(() => import("./pages/Status"));
const TVWall = loadable(() => import("./pages/TVWall"));
const SingleScreen = loadable(() => import("./pages/SingleScreen"));
const Audio = loadable(() => import("./pages/Audio"));
const USB = loadable(() => import("./pages/USB"));
// const RS232 = loadable(() => import("./pages/RS232"));
const Schedule = loadable(() => import("./pages/Schedule"));
const Situation = loadable(() => import("./pages/Situation"));
const Event = loadable(() => import("./pages/Event"));
const Setting = loadable(() => import("./pages/Setting"));

function App({ setLocale }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element=<Login /> />
        <Route
          path="/equipment-status"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<Status />}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/tv-wall"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<TVWall />}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/single-screen"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<SingleScreen />}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/audio"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<Audio />}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/usb"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<USB />}
              />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/rs232"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<RS232 />}
              />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<Schedule />}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/situation"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<Situation />}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/event"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<Event />}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <PrivateRoute>
              <ResponsiveLayout
                topbar={<Topbar />}
                sidebar={<Sidebar setLocale={setLocale} />}
                main={<Setting />}
              />
            </PrivateRoute>
          }
        />
        <Route path="*" element=<Login /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
