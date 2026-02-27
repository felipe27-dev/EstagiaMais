import Header from "@/components/layout/Header";
import { CardShowResumes } from "../components/CardShowResumes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import { DeleteModal } from "../components/DeleteModal";

export const AcessResumes = () => {
  const navigate = useNavigate();
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const [curriculos, setCurriculos] = useState([
    {
      id: 90,
      nome: "Felipe de Souza Rosa",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
    {
      id: 9934,
      nome: "Joaquim Oliveira",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
  ]);

  // 2. Função para deletar (Isolada e Limpa)
  const handleConfirmDelete = () => {
    if (!resumeToDelete) return;
    console.log(`Deletando currículo ID: ${resumeToDelete}`);
    setCurriculos((prev) => prev.filter((c) => c.id !== resumeToDelete));
    setResumeToDelete(null);
  };

  return (
    <>
      <Header />
      <div className="h-screen flex justify-center items-center bg-background">
        <div className="bg-white w-[70%] min-w-[350px] rounded-3xl border border-gray-100 shadow-xl p-10 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center animate-fade-in text-center pb-6">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Currículos Disponíveis
          </h1>

          <CardShowResumes
            curriculos={curriculos}
            handleCloseResumes={() => navigate("/")}
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
                  onClick={() => navigate(`/resume-edit/${resume.id}`)}
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
