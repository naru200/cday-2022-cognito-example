import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import App from "./App";
import "./index.css";

const oidcConfig = {
  authority: `https://cognito-idp.${
    import.meta.env.COGNITO_REGION
  }.amazonaws.com/${import.meta.env.COGNITO_USER_POOL_ID}`,
  client_id: import.meta.env.COGNITO_CLIENT_ID,
  redirect_uri: window.location.origin,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
