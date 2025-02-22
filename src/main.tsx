import App from "@/App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// biome-ignore lint/style/noNonNullAssertion: This is a root component, so it's okay to use non-null assertion.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
