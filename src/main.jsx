import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import RouteWrapper from "./RouteWrapper";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteWrapper />
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorkerRegistration.register();