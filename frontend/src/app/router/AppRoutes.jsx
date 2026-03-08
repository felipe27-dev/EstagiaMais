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
const ResumeSelected = lazy(async () => {
  await delay();
  const module = await import("@/features/resume/pages/ResumeSelected");
  return { default: module.ResumeSelected };
});

const ChangeInfos = lazy(async () => {
  await delay();
  const module = await import("@/features/auth/pages/ChangeInfos");
  return { default: module.ChangeInfos };
});

const AccessResume = lazy(async () => {
  await delay();
  const module = await import("@/features/resume/pages/AccessResumes");
  return { default: module.AcessResumes };
});

const ResumeEdit = lazy(async () => {
  await delay();
  const module = await import("@/features/resume/pages/ResumeEdit");
  return { default: module.ResumeEdit };
});

const SendResumesDatabase = lazy(async () => {
  await delay();
  const module = await import("@/features/resume/pages/SendResumesDatabase");
  return { default: module.SendResumesDatabase };
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
        <Route path="/resume/:id" element={<ResumeSelected />} />
        <Route path="/recadastro" element={<ChangeInfos />} />
        <Route path="/access-resume" element={<AccessResume />} />
        <Route path="/resume-edit/:id" element={<ResumeEdit />} />
        <Route
          path="/send-resumes-database"
          element={<SendResumesDatabase />}
        />
      </Routes>
    </Suspense>
  );
};
