import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  FileText,
  Save,
  Loader2
} from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";
import { resumeService } from "../../../services/resumeServices"; // Ajuste o caminho se necessário

export const ResumeVerificationFlow = ({ drafts = [] }) => {
  // Inicializamos o estado com os dados que vieram do backend
  const [resumes, setResumes] = useState(drafts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Controle de loading final
  const navigate = useNavigate();

  const currentResume = resumes[currentIndex];
  const isLastResume = currentIndex === resumes.length - 1;

  // Função genérica para atualizar os campos do currículo atual
  const handleInputChange = (field, value) => {
    setResumes((prev) => {
      const updatedResumes = [...prev];
      updatedResumes[currentIndex] = {
        ...updatedResumes[currentIndex],
        [field]: value,
      };
      return updatedResumes;
    });
  };

  const handleNext = () => { if (currentIndex < resumes.length - 1) setCurrentIndex((prev) => prev + 1) };

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex((prev) => prev - 1); };

  const handleFinalize = async () => {
    setIsSaving(true);
    try {
      const savePromises = resumes.map((resume) => resumeService.create(resume));
      
      await Promise.all(savePromises);
      
      setIsFinished(true);
    } catch (error) {
      console.error("Erro ao salvar currículos finais:", error);
      alert("Houve um erro ao salvar no banco. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-[#374151]  rounded-2xl shadow-lg border border-gray-100 p-12 text-center animate-fade-in">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Revisão Concluída!
        </h2>
        <p className="text-gray-600 dark:text-white mb-8">
          Todos os currículos foram verificados e adicionados ao banco de dados com sucesso.
        </p>
        <AppButton
          onClick={() => navigate("/resumes")} // Ajuste para a sua rota de listagem
          className="bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all"
        >
          Ver Currículos Salvos
        </AppButton>
      </div>
    );
  }

  if (!currentResume) return null;

  return (
    <div className="w-full h-[85vh] bg-white dark:bg-[#374151]  mb-10 rounded-2xl shadow-xl border  overflow-hidden flex flex-col animate-fade-in">
      {/* Cabeçalho */}
      <div className=" border-b  p-5 flex items-center justify-between z-10 shrink-0">
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Verificação</h2>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-blue-600 bg-blue-100 py-1.5 px-4 rounded-full">
            Currículo {currentIndex + 1}/{resumes.length}
          </span>
        </div>
      </div>

      {/* Layout Principal Dividido */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Lado Esquerdo: Formulário de Edição */}
        <div className="w-1/2 bg-white dark:bg-[#374151]  p-8 overflow-y-auto border-r border-gray-200 custom-scrollbar">
          <div className="grid grid-cols-1 gap-8">
            
            {/* Seção: Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-white border-b pb-2 mb-4">
                Informações Pessoais
              </h3>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500  dark:text-white mb-1 block">Nome Completo</label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    value={currentResume.name_candidate || ""}
                    onChange={(e) => handleInputChange("name_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500  dark:text-white mb-1 block">E-mail</label>
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="email"
                    value={currentResume.email_candidate || ""}
                    onChange={(e) => handleInputChange("email_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500  dark:text-white mb-1 block">Telefone</label>
                <div className="relative flex items-center">
                  <Phone size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    value={currentResume.phone_candidate || ""}
                    onChange={(e) => handleInputChange("phone_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Dados Profissionais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-white border-b pb-2 mb-4">
                Perfil Profissional
              </h3>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500  dark:text-white mb-1 block">Formação Acadêmica</label>
                <div className="relative flex items-start">
                  <GraduationCap size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    rows={2}
                    value={currentResume.degree_candidate || ""}
                    onChange={(e) => handleInputChange("degree_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500  dark:text-white mb-1 block">Resumo do Perfil gerado pela IA</label>
                <textarea
                  rows={6}
                  value={currentResume.profile_candidate || ""}
                  onChange={(e) => handleInputChange("profile_candidate", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Visualizador de PDF Permanente */}
        <div className="w-1/2 h-full bg-[#525659] flex flex-col items-center justify-center">
          {currentResume.resume_archive ? (
            <iframe
              // Substitui temporariamente HTTPS por HTTP para evitar erro de certificado no localhost
              src={`${currentResume.resume_archive.replace("http://", "https://")}#view=FitH&toolbar=0&navpanes=0`}
              title="Visualizador de PDF Original"
              className="w-full h-full border-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <FileText size={48} className="mb-4 opacity-50" />
              <p>Nenhum PDF atrelado a este registro.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Ações de Navegação */}
      <div className="border-t border-gray-200 p-5 flex items-center justify-between z-10 shrink-0">
        <AppButton
          onClick={handlePrev}
          disabled={currentIndex === 0 || isSaving}
          padding="4px 18px"
        >
          <ChevronLeft size={20} /> Anterior
        </AppButton>

        {isLastResume ? (
          <AppButton 
            onClick={handleFinalize} 
            padding="4px 18px"
            disabled={isSaving}
          >
            {isSaving ? (
              <> <Loader2 className="mr-2 animate-spin" size={20} /> Salvando... </>
            ) : (
              <> <Save className="mr-2" size={20} /> Finalizar Envio </>
            )}
          </AppButton>
        ) : (
          <AppButton onClick={handleNext} padding="4px 18px">
            Próximo <ChevronRight className="ml-2" size={20} />
          </AppButton>
        )}
      </div>
    </div>
  );
};