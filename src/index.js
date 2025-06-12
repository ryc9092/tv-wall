import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ProviderApp from "./ProviderApp";
import { ConfigProvider } from "antd";

const config = {
  token: {
    colorPrimary: "#45413e",
    colorPrimaryBg: "#f0f0f0",
    colorPrimaryBgHover: "#eaeaea"
  },
  components: {
    Radio: {
      colorPrimary: "#45413e",
    },
    Checkbox: {
      colorPrimary: "#45413e",
    },
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ConfigProvider theme={config}>
      <ProviderApp />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
