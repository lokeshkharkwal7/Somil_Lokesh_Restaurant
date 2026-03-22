import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/authContext"; // fixed casing
import AppRoutes from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    // BUG 7 FIX: BrowserRouter must wrap everything so all children
    // (including AuthProvider) have access to router context
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;