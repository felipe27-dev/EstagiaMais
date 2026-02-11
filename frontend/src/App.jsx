import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "@/app/router/AppRoutes";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { MuiThemeProvider } from "@/app/providers/ThemeProvider";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("Ta rodando sim uau muito teste mesmo teste");
    console.log("funciona mesmo");
  });

  return (
    <QueryProvider>
      {}
      <MuiThemeProvider>
        <BrowserRouter>
          <main className="min-h-screen bg-gray-50" form="" alvo="">
            <AppRoutes />
          </main>
        </BrowserRouter>
      </MuiThemeProvider>
    </QueryProvider>
  );
}

export default App;
