import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TextField } from "@mui/material";
import { IoClose } from "react-icons/io5";
import Header from "@/components/layout/Header";
import { AppButton } from "@/components/ui/AppButton";
import { CardLoadingAnalysis } from "@/features/resume/components/CardLoadingAnalysis";
import { AnalysisDashboard } from "@/features/resume/components/AnalysisDashboard";
import { resumeSchema } from "@/features/resume/components/resumeSchema.js";
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

  // --- Lógica de Envio Real com React Query ---
  const { mutate: performAnalysis, isPending } = useMutation({
    onMutate: () => {
      setCurrentStep("PROCESSING");
    },
    mutationFn: async (payload) => {
      const response = await resumeService.analyzeMatch(payload.text, payload.tags);
      return response;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setTimeout(() => {
        setCurrentStep("RESULT");
      }, 3000);
    },
    onError: () => {
      setCurrentStep("SEARCH");
      alert("Houve um erro na análise. Tente novamente.");
    }
  });

  const onSubmit = (data) => {
    if (tags.length === 0) {
      alert("Por favor, adicione pelo menos uma categoria (tag).");
      return;
    }
    performAnalysis({ text: data.text, tags: tags });
  };

  const handleKeyDown = (event) => {
    const currentValue = event.target.value;
    if (event.key === "Enter" && currentValue.trim() !== "") {
      event.preventDefault();
      setTags([...tags, currentValue]);
      event.target.value = "";
    } else if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <>
      <Header fixed={false} />
      
      {/* Removi o bg-background fixo. Agora ele herda o CssBaseline e ganha py-8 no mobile para não grudar no topo */}
      <div className="w-full min-h-[calc(100vh-100px)] flex justify-center items-center py-8 lg:py-0 px-4">
        
        {/* TELA 1: O FORMULÁRIO DE BUSCA */}
        {currentStep === "SEARCH" && (
          <div className="bg-white dark:bg-[#374151] mt-0 lg:-mt-20 w-full sm:w-[90%] md:w-[80%] max-w-4xl rounded-3xl border border-gray-200 dark:border-gray-700 card-border-glow shadow-xl overflow-hidden flex flex-col p-6 sm:p-10 hover:scale-[1.01] transition-transform">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              
              <div className="w-full flex flex-col justify-center">
                <h1 className="text-xl sm:text-2xl font-bold text-primary dark:text-white mb-4">
                  Envie a descrição da vaga
                </h1>
                <TextField
                  multiline
                  rows={5} // Diminuído levemente para não ocupar a tela inteira do celular
                  inputProps={{ style: { fontSize: "16px" } }} // Fonte ajustada para mobile
                  placeholder="Ex: Procuro um Desenvolvedor Pleno com experiência em React e Python..."
                  {...register("text")}
                  error={!!errors.text}
                  helperText={errors.text?.message}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                    }
                  }}
                />
              </div>

              <div className="w-full flex flex-col justify-center mt-6 md:mt-8">
                <h1 className="text-xl sm:text-2xl font-bold text-primary dark:text-white mb-4">
                  Tags obrigatórias (Pressione Enter)
                </h1>
                <TextField
                  inputProps={{ style: { fontSize: "16px" } }}
                  onKeyDown={handleKeyDown}
                  placeholder={tags.length === 0 ? "Ex: React, Python, Pleno..." : ""}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <div className="flex flex-wrap gap-2 my-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-primary py-1.5 px-3 rounded-full font-bold text-xs sm:text-sm text-white flex items-center gap-1.5"
                          >
                            {tag}
                            <IoClose
                              size={16}
                              className="cursor-pointer hover:text-gray-200 transition-colors"
                              onClick={() => setTags(tags.filter((_, i) => i !== index))}
                            />
                          </span>
                        ))}
                      </div>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": { flexWrap: "wrap", alignItems: "center", gap: "4px" },
                    "& .MuiInputBase-input": { width: "auto", flexGrow: 1, minWidth: "120px" },
                  }}
                />
              </div>

              {/* Botão Responsivo */}
              <div className="w-full flex justify-center sm:justify-end mt-8">
                <AppButton
                  color="primary"
                  type="submit"
                  disabled={isPending}
                  padding="12px 26px"
                  radius="18px"
                  className="w-full sm:w-auto"
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