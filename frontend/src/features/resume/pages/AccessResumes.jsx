import Header from "@/components/layout/Header";
import { CardShowResumes } from "../components/CardShowResumes";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import { DeleteModal } from "../components/DeleteModal";
import { resumeService } from "../../../services/resumeServices";

export const AccessResumes = () => {
  const navigate = useNavigate();
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const [curriculos, setCurriculos] = useState([]);

  const handleGetAll = useCallback(async() => {
    try{
      const data = await resumeService.getAll();
      setCurriculos(data);
    }catch(e){
      console.error("Erro ao buscar currículos:", e);
    }
  },[])

  useEffect(()=>{
    handleGetAll();
  },[handleGetAll])

  const handleConfirmDelete = async() => {
    try{
      await resumeService.delete(resumeToDelete);
      setResumeToDelete(null); 
      setCurriculos((prev) => prev.filter((c) => c.id !== resumeToDelete));
      console.log("Currículo deletado com sucesso!");
    }catch(e){
      console.error("Erro ao deletar currículo:", e);
    }
  };

  return (
    <>
      {/* Header com fixed={false} ajuda a não encavalar no conteúdo no mobile */}
      <Header fixed={false} />
      
      {/* Container principal flexível com respiro nas bordas (px-4 py-8) */}
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-start md:items-center py-8 px-4">
        
        {/* Card Adaptável com Altura Máxima (max-h) e bordas preparadas para o Dark Mode */}
        <div className="bg-white dark:bg-[#374151] w-full sm:w-[95%] md:w-[85%] lg:w-[70%] max-w-6xl max-h-[85vh] rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-4 md:p-10 hover:shadow-2xl transition-all duration-300 flex flex-col items-center animate-fade-in text-center overflow-hidden">
          
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4 md:mb-6 shrink-0">
            Currículos Disponíveis
          </h1>

          {/* Esta div protege a sua lista. Se tiver muito currículo, aparece uma barra de rolagem só aqui dentro! */}
          <div className="w-full flex-1 overflow-y-auto custom-scrollbar px-1 md:px-4">
            <CardShowResumes
              curriculos={curriculos}
              handleCloseResumes={() => navigate("/")}
              onSelectResume={(resume) => navigate(`/resume-selected/${resume.id}`, { state: { curriculo: resume } })}
              renderMenuOptions={(resume) => (
                <>
                  <p
                    className="menu-item-class cursor-pointer hover:text-red-500"
                    onClick={() => setResumeToDelete(resume.id)}
                  >
                    Deletar
                  </p>
                  <p
                    className="menu-item-class"
                    onClick={() => navigate(`/resume-edit/${resume.id}`, { state: { curriculo: resume } })}
                  >
                    Editar
                  </p>
                  <p className="menu-item-class">Baixar</p>
                </>
              )}
            />
          </div>

          <Modal
            open={!!resumeToDelete}
            onClose={() => setResumeToDelete(null)}
          >
            <DeleteModal
              id={resumeToDelete}
              onCloseModal={() => setResumeToDelete(null)}
              onConfirm={handleConfirmDelete}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};