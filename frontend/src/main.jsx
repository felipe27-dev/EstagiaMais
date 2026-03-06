import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@/styles/index.css";

async function enableMocking() {

  return; 
  /*
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });*/
}

enableMocking().then(() => {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});