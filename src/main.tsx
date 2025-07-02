import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "reactflow/dist/style.css";
import "./index.css";
import App from "./App.tsx";

// Wait for Rock's jQuery to be fully loaded before initializing our app
function waitForRockJQuery() {
  return new Promise<void>((resolve) => {
    // Check if jQuery is already loaded
    if (
      typeof (window as any).jQuery !== "undefined" &&
      (window as any).jQuery.fn &&
      (window as any).jQuery.fn.jquery
    ) {
      resolve();
      return;
    }

    // Wait for jQuery to load
    const checkInterval = setInterval(() => {
      if (
        typeof (window as any).jQuery !== "undefined" &&
        (window as any).jQuery.fn &&
        (window as any).jQuery.fn.jquery
      ) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 50);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve(); // Continue anyway
    }, 5000);
  });
}

// Function to find the mount point
function getMountPoint() {
  const mountPoint = document.getElementById("ev-serving-app");
  if (mountPoint) {
    return mountPoint;
  }

  const fallback = document.createElement("div");
  fallback.id = "ev-serving-app";
  document.body.appendChild(fallback);
  return fallback;
}

// Initialize app after jQuery is ready
waitForRockJQuery().then(() => {
  const mountPoint = getMountPoint();

  createRoot(mountPoint).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
