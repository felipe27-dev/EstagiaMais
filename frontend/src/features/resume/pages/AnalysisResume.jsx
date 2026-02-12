import Header from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EstagiaLoader } from "@/components/layout/Loading";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { AppButton } from "@/components/ui/AppButton";
import { CardLoadingAnalysis } from "@/features/resume/components/CardLoadingAnalysis";
import { useState, useEffect } from "react"; // Importar hooks

// Variável externa para teste (mantive sua lógica)
let mockStep = 0;

export const AnalysisResume = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estado Visual: Controla se mostramos o resultado ou a animação final
  const [showResult, setShowResult] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["analise-curriculo", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (mockStep === 0) {
        mockStep++;
        return { status: "PROCESSING" };
      }
      return { status: "COMPLETED", result: "Dados prontos" };
    },
    refetchInterval: (query) => {
      return query.state.data?.status === "PROCESSING" ? 2000 : false;
    },
  });

  useEffect(() => {
    if (data?.status === "COMPLETED") {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data?.status]);

  if (isPending) return <EstagiaLoader />;
  if (isError) return <ErrorFallback error="Erro ao carregar análise" />;

  if (data?.status === "PROCESSING" || !showResult) {
    return (
      <>
        <Header />
        <div className="h-screen flex justify-center items-center bg-background">
          <CardLoadingAnalysis isCompleted={data?.status === "COMPLETED"} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="h-screen flex justify-center items-center bg-background">
        <div
          className={`bg-white w-[60%] rounded-3xl border border-gray-200
                    card-border-glow shadow-xl overflow-hidden items-center justify-center  flex-col flex-cols-1 p-10 hover:scale-[1.05] transition-transform`}
        >
          <h1 className="text-3xl font-bold text-green mb-6">
            Análise {id} concluída!
          </h1>
          <h1 className="text-2xl font-bold text-primary mb-6">
            O que deseja fazer com os currículos?
          </h1>
          <div className="w-full flex justify-center mt-3 gap-4 flex-col">
            <AppButton
              children="Criar Pasta"
              color="secondary"
              onClick={() => navigate("/search-resume")}
            />
            <AppButton
              children="Enviar"
              color="primary"
              onClick={() => navigate("/")}
            />
            <AppButton
              children="Visualizar"
              color="action"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      </div>
    </>
  );
};
