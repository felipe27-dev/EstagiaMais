import { AppButton } from "@/components/ui/AppButton";
import { Modal } from "@mui/material";
import { useState } from "react";
import { ShareModal } from "@/features/resume/components/ShareModal";
import { CardShowResumes } from "@/features/resume/components/CardShowResumes";

// CardWrapper isolado (Boa prática: manter fora do componente principal se não usa state dele)
const CardWrapper = ({ children }) => (
  <div className="bg-white w-[70%] min-w-[350px] rounded-3xl border border-gray-100 shadow-xl p-10 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center animate-fade-in text-center pb-6">
    {children}
  </div>
);

export const AnalysisDashboard = ({ id }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [visualMode, setVisualMode] = useState(false);
  const [curriculos] = useState([
    {
      nome: "Felipe de Souza Rosa",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
    {
      nome: "Joaquim Oliveira",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
    {
      nome: "Fernanda Silveira",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
    {
      nome: "Carolina Silva",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
    {
      nome: "Jorge Junior",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
    {
      nome: "Caroline Borges",
      faculdade: "Sistemas de Informação",
      empresa: "Poli",
      cargo: "Desenvolvedor Web",
    },
  ]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/logo_principal-nobg.png";
    link.download = `relatorio-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (visualMode) {
    return (
      <CardWrapper>
        <h1 className="text-3xl font-bold text-green-600 mb-2 -mt-6">
          Visualizando Análise #{id}
        </h1>
        <CardShowResumes
          curriculos={curriculos}
          handleCloseResumes={() => setVisualMode(false)}
        />
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Análise concluída!
      </h1>
      <p className="text-gray-400 text-sm mb-8">ID: {id}</p>

      <h2 className="text-2xl font-bold text-primary mb-6">
        O que deseja fazer com os currículos?
      </h2>

      <div className="w-full flex flex-col gap-3">
        <AppButton color="secondary" onClick={() => handleDownload()}>
          Criar Pasta
        </AppButton>
        <AppButton color="primary" onClick={() => setModalOpen(true)}>
          Enviar
        </AppButton>
        <AppButton color="action" onClick={() => setVisualMode(true)}>
          Visualizar
        </AppButton>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ShareModal
          id={id}
          onCloseModal={() => setModalOpen(false)}
          onDownload={handleDownload}
        />
      </Modal>
    </CardWrapper>
  );
};
