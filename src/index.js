import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "thirdweb/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThirdwebProvider>
    <App />
  </ThirdwebProvider>
);