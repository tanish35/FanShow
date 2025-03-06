import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import axios from "axios";
import { ThemeProvider } from "@/lib/ThemeProvider";

const apiClient2 = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL_2,
  withCredentials: true,
});
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
export { apiClient2 };
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <Toaster richColors closeButton />
  </StrictMode>
);
