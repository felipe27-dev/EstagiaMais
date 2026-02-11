import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/router/AppRoutes";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { MuiThemeProvider } from "@/app/providers/ThemeProvider";

function App() {
  return (
    <QueryProvider>
      <MuiThemeProvider>
        <BrowserRouter>
          <main className="min-h-screen bg-gray-50">
            <AppRoutes />
          </main>
        </BrowserRouter>
      </MuiThemeProvider>
    </QueryProvider>
  );
}

export default App;