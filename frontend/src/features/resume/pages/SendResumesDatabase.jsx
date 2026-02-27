import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { EstagiaLoader } from "@/components/layout/Loading";
import { ErrorFallback } from "@/components/ui/ErrorFallback";

// Importação fictícia dos componentes que você já deve ter ou criará
import { ResumeUploadForm } from "@/features/resume/components/ResumeUploadForm";
import { CardLoadingAnalysis } from "@/features/resume/components/CardLoadingAnalysis";
//import { ResumeVerificationFlow } from "@/features/resume/components/ResumeVerificationFlow";

// Variável para simular o progresso do backend no mock
let mockProgressStep = 0;

export const SendResumesDatabase = () => {
  const [currentStep, setCurrentStep] = useState("UPLOAD");

  // --- 1. Lógica de Envio (Mutation) ---
  const { mutate: uploadResumes, isPending: isUploading } = useMutation({
    mutationFn: async (/*files*/) => {
      // Simula o envio dos arquivos para o servidor
      await new Promise((resolve) => setTimeout(resolve, 800));
      mockProgressStep = 0; // Reseta o mock para a nova análise
      return { batchId: "batch_" + Math.random().toString(36).substr(2, 9) };
    },
    onSuccess: () => {
      setCurrentStep("PROCESSING");
    },
  });

  // --- 2. Lógica de Polling (Status da IA) ---
  const { data: analysisData, isError } = useQuery({
    queryKey: ["analysis-status"],
    queryFn: async () => {
      // Simula a chamada de API que verifica o status no banco
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (mockProgressStep < 3) {
        mockProgressStep++;
        return { status: "PROCESSING" };
      }
      return { status: "COMPLETED" };
    },
    // Só ativa o polling quando estiver na tela de carregamento
    enabled: currentStep === "PROCESSING",
    refetchInterval: (query) => {
      return query.state.data?.status === "PROCESSING" ? 2000 : false;
    },
  });

  // --- 3. Transição Automática de Tela ---
  useEffect(() => {
    if (analysisData?.status === "COMPLETED") {
      // Delay de 3s para o usuário ver a animação de "Concluído" antes de mudar
      const timer = setTimeout(() => {
        setCurrentStep("VERIFICATION");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [analysisData?.status]);

  // --- Renderização por Estado ---

  if (isError)
    return <ErrorFallback error="Erro ao processar lote de currículos" />;

  const renderContent = () => {
    switch (currentStep) {
      case "UPLOAD":
        return isUploading ? (
          <EstagiaLoader />
        ) : (
          <ResumeUploadForm onUpload={uploadResumes} />
        );

      case "PROCESSING":
        return (
          <div className="flex flex-col items-center">
            <CardLoadingAnalysis
              isCompleted={analysisData?.status === "COMPLETED"}
            />
          </div>
        );

      case "VERIFICATION":
        return (
          <div className="w-full h-full max-w-5xl mx-auto mt-6">
            {/* Aqui entra o componente que mostra currículo por currículo */}
            {/*<ResumeVerificationFlow />*/}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />

      <div
        className={`h-screen w-full bg-background flex justify-center items-center `}
      >
        {renderContent()}
      </div>
    </>
  );
};
