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
    try{
      if (location.state?.curriculo){
        const { curriculo } = location.state;
        setCurriculo(curriculo);
      }else{
        if (!id || isNaN(Number(id))) {
           console.error("ID inválido na URL:", id);
           return; 
        }
        const data = await resumeService.getById(id);
        setCurriculo(data);
        console.log("Currículo selecionado:", curriculo);
      }
    }catch(e){
      console.error("Erro encontrado:",e)
    }

  },[id,location.state])

  useEffect(() => {
    handleResumeSelect() 
  },[handleResumeSelect])

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
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-primary cursor-pointer"
            >
              Voltar
            </button>
          </div>

          {/* Área do PDF */}
          <div className="flex-1 w-full h-full bg-gray-100 relative rounded-2xl">
            <iframe
              src={(curriculo?.resume_archive?.replace("https://", "http://"))}
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
