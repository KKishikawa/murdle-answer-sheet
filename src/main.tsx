import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: This is a root component, so it's okay to use non-null assertion.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
