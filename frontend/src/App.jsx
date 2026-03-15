import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/router/AppRoutes";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { MuiThemeProvider } from "@/app/providers/ThemeProvider";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ui/ErrorFallback";

function App() {
  return (
    <QueryProvider>
      <MuiThemeProvider>
        <BrowserRouter>
          <main className="min-h-screen items-center text-center ">
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                window.location.href = "/";
              }}
            >
              <AppRoutes />
            </ErrorBoundary>
          </main>
        </BrowserRouter>
      </MuiThemeProvider>
    </QueryProvider>
  );
}

export default App;
