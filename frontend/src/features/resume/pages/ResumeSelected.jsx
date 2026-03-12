import { useLocation, useNavigate,useParams } from "react-router-dom";
import { useEffect, useState,useCallback } from "react";
import Header from "@/components/layout/Header";
import curriculoDemo from "@/assets/Curriculo_Felipe_de_Souza_Rosa.pdf";
import { resumeService } from "../../../services/resumeServices";

export const ResumeSelected = () => {
  const location = useLocation();
  //pega o id, que está na url
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculo, setCurriculo] = useState(null);

  const handleResumeSelect = useCallback(async() => {
    try {
      const savedData = localStorage.getItem(`resume_data_${id}`);
      if (savedData) {
        setCurriculo(JSON.parse(savedData));
        return;
      }
      if (location.state?.curriculo) {
        setCurriculo(location.state.curriculo);
        return;
      }
      if (!id || isNaN(Number(id))) return;
      const data = await resumeService.getById(id);
      setCurriculo(data);
      
    } catch(e) {
      console.error("Erro encontrado:", e);
    }
  }, [id, location.state]);

  useEffect(() => {
    handleResumeSelect();
  }, [handleResumeSelect]);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      window.close();
    }
  };

  return (
    <>
      <Header />
      <div className="h-scren max-h-full flex justify-center items-center bg-gray-50 pt-30 pb-10">
        <div className="bg-white w-[80%] rounded-3xl p-3 border border-gray-200 shadow-xl overflow-hidden flex flex-col transition-transform duration-300">
          {/* Cabeçalho do Card */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">
              Currículo de {curriculo?.name_candidate || "Candidato"}
            </h1>
            <button
              onClick={handleGoBack}
              className="text-sm text-gray-500 hover:text-primary cursor-pointer"
            >
              Voltar
            </button>
          </div>
          {/* Mostrar score e feedback da análise */}
          {(curriculo?.score && curriculo?.feedback) &&(
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center flex-row">
              <span className="text-2xl font-bold text-primary mr-2 text-nowrap">
                Score: {curriculo?.score || "0"}
              </span>
            </div>
            <div className="flex items-center flex-col">
              <span className="text-primary text-lg font-bold">Feedback</span>
              <span className="text-md font-semibold text-gray-500 mr-1 text-center ml-25">
                {curriculo?.feedback || "Nenhum feedback disponível."}
              </span>
            </div>
          </div>)}
          {/* Área do PDF */}
          <div className="flex-1 w-full h-full bg-gray-100 relative rounded-2xl">
            <iframe
              src={(curriculo?.resume_archive?.replace("http://", "https://"))}
              className="w-full rounded-xl h-175"
              title="Visualizador de Currículo"
              style={{ border: "none" }}
            >
              <p className="p-10 text-center">
                Seu navegador não suporta visualização de PDF.
                <a
                  href={curriculo?.resume_archive }
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
