import { AppButton } from "@/components/ui/AppButton";
import { Modal } from "@mui/material";
import { useState } from "react";
import JSZip from "jszip";
import { ShareModal } from "@/features/resume/components/ShareModal";
import { CardShowResumes } from "@/features/resume/components/CardShowResumes";

const CardWrapper = ({ children }) => (
  <div className="bg-white dark:bg-[#374151] w-[90%] sm:w-auto sm:min-w-87.5 max-w-sm md:max-w-md rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 md:p-10 pb-6 md:pb-8 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center animate-fade-in text-center mt-4 md:-mt-30 mx-auto">
    {children}
  </div>
);

export const AnalysisDashboard = ({ analysisData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [visualMode, setVisualMode] = useState(false);
  
  // O seu estado controlando os currículos visíveis
  const [curriculos, setCurriculos] = useState(analysisData);

  const handleDownload = async (generate = false) => {
    try {
      const zip = new JSZip();
      
      // ⚠️ ATENÇÃO: Usamos o 'curriculos' (estado) para garantir que não vai baixar os que você retirou!
      const fetchPromises = curriculos.map(async (c) => {
        // Garantindo que pegamos o arquivo se a estrutura for aninhada {resume: {...}} ou plana {...}
        const curr = c.resume || c; 
        const url = curr.resume_archive; 
        if (!url) return;

        const safeUrl = url.replace("http://", "https://");
        const response = await fetch(safeUrl);
        const blob = await response.blob();
        
        const fileName = `curriculo_${curr.name_candidate.replace(/\s+/g, "_")}.pdf`; 
        zip.file(fileName, blob);
      });

      await Promise.all(fetchPromises);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Se a intenção era apenas gerar o ZIP para compartilhar, devolvemos aqui
      if (generate) return zipBlob;
      
      // Criando a tag dinamicamente para o download (O que estava faltando)
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `curriculos_estagia_${Date.now()}.zip`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, 100);

    } catch (error) {
      console.error("Erro ao gerar o ZIP:", error);
      alert("Houve um erro ao tentar baixar e compactar os currículos.");
    }
  };
  
  const handleDownloadResume = async (curriculo) => {
    try {
      // 1. Garante que pegamos os dados certos (caso o objeto venha aninhado como {resume: {...}})
      const dados = curriculo.resume || curriculo;
      const url = dados.resume_archive;
      if (!url) {
        alert("Arquivo do currículo não encontrado.");
        return;
      }

      const safeUrl = url.replace("http://", "https://");

      const response = await fetch(safeUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      const safeName = (dados.name_candidate || "Candidato").replace(/\s+/g, "_");
      a.download = `curriculo_estagia_${safeName}.pdf`;
      
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl); 
      }, 100);

    } catch (error) {
      console.error("Erro ao fazer o download:", error);
      alert("Houve um problema ao baixar o currículo.");
    }
  };

  const handleShare = async () => {
    try {
      // 1. MÁGICA: Faltava o "await" aqui! Agora ele espera o ZIP existir.
      const zipBlob = await handleDownload(true); 
      
      const zipFileName = `curriculos_estagia_${Date.now()}.zip`;
      const zipFile = new File([zipBlob], zipFileName, { type: "application/zip" });
      
      if (navigator.canShare && navigator.canShare({ files: [zipFile] })) {
        try {
          await navigator.share({
            title: "Currículos Selecionados - Estagia+",
            text: "Olá! Segue em anexo o pacote com os melhores currículos filtrados pela IA do Estagia+.",
            files: [zipFile],
          });
          console.log("Arquivo compartilhado com sucesso!");
        } catch (shareError) {
          // Se o navegador bloquear (Permission denied), joga para o Catch principal
          if (shareError.name !== "AbortError") throw shareError;
        }
      } else {
        throw new Error("Não suportado");
      }
    } catch (error) {
      // O PLANO B: Se o Windows gritar, o React força o download silenciosamente.
      console.log("Compartilhamento bloqueado pelo SO. Forçando download plano B...");
      handleDownload(false); 
    }
  };

  if (visualMode) {
    return (
      <CardWrapper>
        <h1 className="text-3xl font-bold text-green-600 mb-2 -mt-2">
          Visualizando Análise
        </h1>
        <CardShowResumes
          curriculos={curriculos}
          handleCloseResumes={() => setVisualMode(false)}
          // 2. CORREÇÃO DO MENU: Pegando exatamente o currículo que foi clicado
          renderMenuOptions={(curriculoClicado, fecharMenu) => (
            <>
              <p 
                className="menu-item-class text-red-500 font-bold cursor-pointer" 
                onClick={() => {
                  setCurriculos(curriculos.filter((c) => c !== curriculoClicado));
                  if (fecharMenu) fecharMenu();
                }}
              > 
                Retirar
              </p>
              <p className="menu-item-class cursor-pointer" onClick={() => { handleDownloadResume(curriculoClicado); if(fecharMenu) fecharMenu(); }}>
                Baixar Todos
              </p>
            </>
          )}
        />
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Análise concluída!
      </h1>

      <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
        O que deseja fazer com os currículos?
      </h2>

      <div className="w-full flex flex-col gap-3">
        <AppButton color="secondary" onClick={() => handleDownload(false)}>
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
          id={analysisData[0]?.id} // Use o ID da análise inteira aqui se necessário
          onCloseModal={() => setModalOpen(false)}
          onDownload={() => handleDownload(false)}
          onShare={handleShare}
        />
      </Modal>
    </CardWrapper>
  );
};