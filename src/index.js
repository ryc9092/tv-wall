import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Store from "./components/store/store";
import reportWebVitals from "./reportWebVitals";
import { IntlProvider } from "react-intl";
import translations from "./i18n/locales";

const root = ReactDOM.createRoot(document.getElementById("root"));
let locale = navigator.language;
locale = window.location.search.replace("?locale=", "") || locale;
const messages = translations[locale];

root.render(
  <React.StrictMode>
    <Store>
      <IntlProvider
        locale={locale}
        key={locale}
        messages={messages}
        defaultLocale="en"
      >
        <App />
      </IntlProvider>
    </Store>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
