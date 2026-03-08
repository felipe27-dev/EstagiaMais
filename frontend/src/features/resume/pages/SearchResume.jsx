import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TextField } from "@mui/material";
import { IoClose } from "react-icons/io5";

import Header from "@/components/layout/Header";
import { AppButton } from "@/components/ui/AppButton";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { CardLoadingAnalysis } from "@/features/resume/components/CardLoadingAnalysis";
import { AnalysisDashboard } from "@/features/resume/components/AnalysisDashboard";
import { resumeSchema } from "@/features/resume/components/resumeSchema.js";

// ⚠️ Importe o seu service que faz o POST para /analyze
import { resumeService } from "../../../services/resumeServices"; 

export const SearchResume = () => {
  // Controle das Etapas: "SEARCH" -> "PROCESSING" -> "RESULT"
  const [currentStep, setCurrentStep] = useState("SEARCH");
  const [tags, setTags] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
  });

  // --- Lógica de Envio Real com React Query (Mutation) ---
  const { mutate: performAnalysis, isPending, isError } = useMutation({
    onMutate: () => {
      // Assim que clica em enviar, muda pra tela de loading
      setCurrentStep("PROCESSING");
    },
    mutationFn: async (payload) => {
      // Faz o POST real para o FastAPI passando o texto e as tags
      const response = await resumeService.analyzeMatch(payload.text, payload.tags);
      return response;
    },
    onSuccess: (data) => {
      // Salva os dados da IA no estado
      setAnalysisResult(data);
      
      // Delay de 3 segundos para o usuário ver o "Concluído" verde
      setTimeout(() => {
        setCurrentStep("RESULT");
      }, 3000);
    },
    onError: () => {
      // Se der erro, volta pro formulário e avisa
      setCurrentStep("SEARCH");
      alert("Houve um erro na análise. Tente novamente.");
    }
  });

  // Função disparada ao submeter o formulário
  const onSubmit = (data) => {
    if (tags.length === 0) {
      alert("Por favor, adicione pelo menos uma categoria (tag).");
      return;
    }
    // Dispara a IA
    performAnalysis({ text: data.text, tags: tags });
  };

  const handleKeyDown = (event) => {
    const currentValue = event.target.value;
    if (event.key === "Enter" && currentValue.trim() !== "") {
      event.preventDefault();
      setTags([...tags, currentValue]);
      event.target.value = "";
    } else if (event.key === "Enter") {
      event.preventDefault(); // Evita que o Enter vazio submeta o formulário sem querer
    }
  };

  // Tratamento de Erro Fatal
  if (isError) return <ErrorFallback error="Erro ao processar a análise com a IA." />;

  // ==========================================
  // RENDERIZAÇÃO CONDICIONAL DAS TELAS
  // ==========================================

  return (
    <>
      <Header fixed={currentStep === "RESULT" ? false : true} />
      
      <div className={`h-screen flex justify-center items-center bg-background ${currentStep === "RESULT" ? "mt-10 mb-10 h-full" : ""}`}>
        
        {/* TELA 1: O FORMULÁRIO DE BUSCA */}
        {currentStep === "SEARCH" && (
          <div className="bg-white w-[80%] rounded-3xl border border-gray-200 card-border-glow shadow-xl overflow-hidden items-center justify-center flex-col p-10 hover:scale-[1.01] transition-transform pb-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full flex-col justify-center">
                <h1 className="text-2xl font-bold text-primary mb-4">
                  Envie a descrição da vaga
                </h1>
                <TextField
                  multiline
                  rows={7}
                  inputProps={{ style: { fontSize: 18 } }}
                  placeholder="Ex: Procuro um Desenvolvedor Pleno com experiência em React e Python..."
                  {...register("text")}
                  error={!!errors.text}
                  helperText={errors.text?.message}
                  fullWidth
                />
              </div>

              <div className="w-full justify-center mt-6 gap-4 flex-col">
                <h1 className="text-2xl font-bold text-primary mb-4">
                  Tags obrigatórias (Pressione Enter)
                </h1>
                <TextField
                  inputProps={{ style: { fontSize: 18 } }}
                  onKeyDown={handleKeyDown}
                  placeholder={tags.length === 0 ? "Ex: React, Python, Pleno..." : ""}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <div className="flex flex-wrap gap-2 my-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-primary py-1 px-3 rounded-full font-bold text-sm text-white flex items-center gap-1"
                          >
                            {tag}
                            <IoClose
                              size={16}
                              className="cursor-pointer hover:text-gray-200"
                              onClick={() => setTags(tags.filter((_, i) => i !== index))}
                            />
                          </span>
                        ))}
                      </div>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": { flexWrap: "wrap", alignItems: "center", gap: "4px" },
                    "& .MuiInputBase-input": { width: "auto", flexGrow: 1, minWidth: "100px", fontSize: "18px" },
                  }}
                />
              </div>
              <div className="w-full flex-col justify-end items-end mt-4 text-right">
                <AppButton
                  color="primary"
                  type="submit"
                  disabled={isPending}
                  padding="8px 26px"
                  radius="18px"
                >
                  {isPending ? "Analisando..." : "Buscar Melhores Candidatos"}
                </AppButton>
              </div>
            </form>
          </div>
        )}

        {/* TELA 2: A ANIMAÇÃO DE CARREGAMENTO */}
        {currentStep === "PROCESSING" && (
          <CardLoadingAnalysis isCompleted={!isPending} />
        )}

        {/* TELA 3: O DASHBOARD DE RESULTADOS */}
        {currentStep === "RESULT" && (
          <AnalysisDashboard analysisData={analysisResult} />
        )}

      </div>
    </>
  );
};

export default SearchResume;