import React from "react";
import ReactDOM from "react-dom";
import { TooltipProvider } from "./tooltipContext";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </React.StrictMode>,
  rootElement
);
