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

  // 2. Função para deletar (Isolada e Limpa)
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
      <Header />
      <div className="h-screen flex justify-center items-center bg-background">
        <div className="bg-white w-[70%] min-w-87.5 rounded-3xl border border-gray-100 shadow-xl p-10 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center animate-fade-in text-center pb-6">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Currículos Disponíveis
          </h1>

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
