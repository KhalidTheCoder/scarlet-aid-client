import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import mainRoutes from "./Routers/mainRoutes";
import "./index.css";
import AuthProvider from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={mainRoutes}></RouterProvider>
      </AuthProvider>
  </React.StrictMode>
);
