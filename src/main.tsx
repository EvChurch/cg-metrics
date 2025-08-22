import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "reactflow/dist/style.css";
import "./index.css";
import App from "./App.tsx";

const root =
  document.getElementById("root") ??
  Object.assign(document.createElement("div"), { id: "root" });

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
