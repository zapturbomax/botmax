import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Polyfill for react-flow-renderer
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

createRoot(document.getElementById("root")!).render(<App />);
