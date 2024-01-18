import React, { useState } from "react";
import "./index.css";
import App from "./App";
import Store from "./components/store/store";
import VarsProvider from "./components/vars/varsProvider";
import { IntlProvider } from "react-intl";
import translations from "./i18n/locales";

function ProviderApp() {
  const [locale, setLocale] = useState(navigator.language);
  const messages = translations[locale];
  return (
    <Store>
      <IntlProvider
        locale={locale}
        key={locale}
        messages={messages}
        defaultLocale="en"
      >
        <VarsProvider>
          <App setLocale={setLocale} />
        </VarsProvider>
      </IntlProvider>
    </Store>
  );
}

export default ProviderApp;
