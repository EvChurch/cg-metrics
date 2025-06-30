import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "reactflow/dist/style.css";
import "./index.css";
import App from "./App.tsx";

// Function to find the mount point
function getMountPoint() {
  // Look for the ev-serving-app mount point
  const mountPoint = document.getElementById("ev-serving-app");
  if (mountPoint) {
    return mountPoint;
  }

  // If it doesn't exist, create it
  const fallback = document.createElement("div");
  fallback.id = "ev-serving-app";
  document.body.appendChild(fallback);
  return fallback;
}

const mountPoint = getMountPoint();

createRoot(mountPoint).render(
  <StrictMode>
    <App />
  </StrictMode>
);
