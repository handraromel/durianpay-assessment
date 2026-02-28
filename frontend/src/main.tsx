import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setBaseURL } from "./utils/httpClient";

setBaseURL(import.meta.env.VITE_API_BASE_URL ?? "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
