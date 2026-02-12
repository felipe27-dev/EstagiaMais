import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@/styles/index.css";

async function enableMocking() {
  // No Vite, usamos import.meta.env.DEV para saber se estamos em desenvolvimento
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

// A ordem aqui é vital:
enableMocking().then(() => {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
