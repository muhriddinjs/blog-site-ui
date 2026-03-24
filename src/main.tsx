import { createRoot } from "react-dom/client";
import { QueryProvider } from "./app/components/providers/QueryProvider";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
);

  