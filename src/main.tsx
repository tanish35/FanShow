import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import axios from "axios";

const apiClient2 = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL_2,
});
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
export { apiClient2 };
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster richColors closeButton />
  </StrictMode>
);
