import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

// 1. O PULO DO GATO: Importe o arquivo aqui!
import curriculoDemo from "@/assets/Curriculo_Felipe_de_Souza_Rosa.pdf";

export const ResumeSelected = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const curriculo = location.state?.curriculo; // Adicionei o optional chaining (?) por segurança

  // Lógica para decidir qual PDF mostrar:
  // Se tiver URL vindo do backend (curriculo.url), usa ela. Se não, usa o import local.
  const pdfUrl = curriculo?.url || curriculoDemo;

  return (
    <>
      <Header />
      <div className="h-scren max-h-full flex justify-center items-center bg-gray-50 pt-30 pb-10">
        <div className="bg-white w-[80%] rounded-3xl p-3 border border-gray-200 shadow-xl overflow-hidden flex flex-col transition-transform duration-300">
          {/* Cabeçalho do Card */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">
              Currículo de {curriculo?.nome || "Candidato"}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-primary cursor-pointer"
            >
              Voltar
            </button>
          </div>

          {/* Área do PDF */}
          <div className="flex-1 w-full h-full bg-gray-100 relative rounded-2xl">
            <iframe
              src={pdfUrl}
              className="w-full rounded-xl h-[700px]"
              title="Visualizador de Currículo"
              style={{ border: "none" }}
            >
              <p className="p-10 text-center">
                Seu navegador não suporta visualização de PDF.
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline ml-1"
                >
                  Clique aqui para baixar.
                </a>
              </p>
            </iframe>
          </div>
        </div>
      </div>
    </>
  );
};
