import Header from "@/components/layout/Header";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EstagiaLoader } from "@/components/layout/Loading";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { CardLoadingAnalysis } from "@/features/resume/components/CardLoadingAnalysis";
import { useState, useEffect } from "react"; // Importar hooks
import { AnalysisDashboard } from "@/features/resume/components/AnalysisDashboard";

// Variável externa para teste (mantive sua lógica)
let mockStep = 0;

export const AnalysisResume = () => {
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
      <Header fixed={false} />
      <div className="h-full mt-10 mb-10 flex justify-center items-center bg-background">
        <AnalysisDashboard id={id} />
      </div>
    </>
  );
};
