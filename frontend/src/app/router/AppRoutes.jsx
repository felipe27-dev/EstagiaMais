import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { EstagiaLoader } from "@/components/layout/Loading";

const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const Home = lazy(async () => {
  await delay();
  const module = await import("@/features/home/pages/Home");
  return { default: module.Home };
});
const LoginPage = lazy(async () => {
  await delay();
  const module = await import("@/features/auth/pages/LoginPage");
  return { default: module.LoginPage };
});
const SearchResume = lazy(async () => {
  await delay();
  const module = await import("@/features/resume/pages/SearchResume");
  return { default: module.SearchResume };
});
const AnalysisResume = lazy(async () => {
  await delay();
  const module = await import("@/features/resume/pages/AnalysisResume");
  return { default: module.AnalysisResume };
});

// Componente de Loading (Simples e Centralizado)
const PageLoader = () => <EstagiaLoader />;

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search-resume" element={<SearchResume />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/analysis-resume/:id" element={<AnalysisResume />} />
      </Routes>
    </Suspense>
  );
};
