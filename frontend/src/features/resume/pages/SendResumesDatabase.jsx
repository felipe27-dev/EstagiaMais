import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { EstagiaLoader } from "@/components/layout/Loading";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { resumeService } from "../../../services/resumeServices";

// Importação fictícia dos componentes que você já deve ter ou criará
import { ResumeUploadForm } from "@/features/resume/components/ResumeUploadForm";
import { CardLoadingAnalysis } from "@/features/resume/components/CardLoadingAnalysis";
import { ResumeVerificationFlow } from "@/features/resume/components/ResumeVerificationFlow";

// Variável para simular o progresso do backend no mock
let mockProgressStep = 0;

export const SendResumesDatabase = () => {
  const [currentStep, setCurrentStep] = useState("UPLOAD");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [scratchAnalysisResult, setScratchAnalysisResult] = useState([]); // Array de rascunhos

  // --- 1. A Única Lógica Real de Envio (Mutation) ---
  const { mutate: uploadResumes, isPending: isUploading } = useMutation({
    // onMutate roda no exato milissegundo em que o usuário clica no botão
    onMutate: () => {
      // Muda a tela imediatamente para a animação de carregamento
      setCurrentStep("PROCESSING"); 
    },
    
    // mutationFn é onde a promessa real acontece
    mutationFn: async (filesToUpload) => {
      try {
        const uploadPromises = filesToUpload.map(async (file) => {
          console.log("Arquivo enviado para análise:", file.name);
          const draftData = await resumeService.uploadAnalysis(file); 
          setScratchAnalysisResult(prev => [...prev, draftData]);
          // Guarda o nome do arquivo original junto com o resultado da IA
          return { ...draftData, originalFileName: file.name };
        });

        const allDrafts = await Promise.all(uploadPromises);
        return allDrafts;

      } catch (e) {
        console.error("Erro ao enviar currículos:", e);
        throw e; 
      }
    },

    // onSuccess roda assim que o Promise.all termina e recebe o array de resultados
    onSuccess: (draftsArray) => {
      // 1. Salva os dados reais da IA no seu estado
      setScratchAnalysisResult(draftsArray);
      
      // 2. Opcional: Um pequeno delay de 1 segundo só para a transição ficar suave
      setTimeout(() => {
        setCurrentStep("VERIFICATION"); // Vai pra tela de edição/revisão
      }, 1000);
    },
    
    onError: () => {
      // Se der erro (ex: backend caiu), volta pra tela de upload
      setCurrentStep("UPLOAD");
      alert("Houve um erro ao analisar os currículos. Tente novamente.");
    }
  });

  // --- Renderização por Estado ---

  const handleUpload = (files) => {
    setUploadedFiles(files); // Guarda os PDFs reais no pai
    uploadResumes(files); // Dispara a mutation para o backend
  };

  const renderContent = () => {
    switch (currentStep) {
      case "UPLOAD":
        return isUploading ? (
          <EstagiaLoader />
        ) : (
          <ResumeUploadForm onUpload={handleUpload} />
        );

      case "PROCESSING":
        return (
          <div className="flex h-full items-center justify-center text-center">
            <CardLoadingAnalysis
              isCompleted={isUploading === false}
              contentFinished="Análise concluída!"
              contentLoad={`Análise em andamento...\n${scratchAnalysisResult.length}/${uploadedFiles.length}`}
            />
          </div>
        );

      case "VERIFICATION":
        return (
          <div className="w-full h-full max-w-5xl mx-auto mt-6">
            {/* Aqui entra o componente que mostra currículo por currículo */}
            <ResumeVerificationFlow drafts={scratchAnalysisResult} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header fixed={false} />

      <div
        className={`h-auto w-full bg-background flex justify-center items-center `}
      >
        {renderContent()}
      </div>
    </>
  );
};
