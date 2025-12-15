import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

window.addEventListener("unhandledrejection", (event) => {
  const errorMessage = event.reason?.message || "";
  const errorStack = event.reason?.stack || "";
  
  if (
    errorMessage.includes("MetaMask") ||
    errorStack.includes("chrome-extension://") ||
    errorStack.includes("moz-extension://")
  ) {
    event.preventDefault();
    console.warn("Browser extension error suppressed:", errorMessage);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
