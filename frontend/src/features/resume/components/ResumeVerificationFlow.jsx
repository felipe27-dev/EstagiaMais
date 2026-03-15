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
import { resumeService } from "../../../services/resumeServices";

export const ResumeVerificationFlow = ({ drafts = [] }) => {
  const [resumes, setResumes] = useState(drafts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const currentResume = resumes[currentIndex];
  const isLastResume = currentIndex === resumes.length - 1;

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
      <div className="w-[90%] md:w-full max-w-2xl mx-auto bg-white dark:bg-[#374151] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 md:p-12 text-center animate-fade-in mt-10">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Revisão Concluída!
        </h2>
        <p className="text-gray-600 dark:text-gray-200 mb-8">
          Todos os currículos foram verificados e adicionados ao banco de dados com sucesso.
        </p>
        <AppButton
          onClick={() => navigate("/resumes")} 
          className="w-full sm:w-auto"
        >
          Ver Currículos Salvos
        </AppButton>
      </div>
    );
  }

  if (!currentResume) return null;

  return (
    // Altura flexível no mobile (h-auto) e fixa no PC (lg:h-[85vh])
    <div className="w-[95%] lg:w-full max-w-7xl mx-auto h-auto lg:h-[85vh] bg-white dark:bg-[#374151] my-6 lg:mb-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-fade-in">
      
      {/* Cabeçalho */}
      <div className="border-b border-gray-200 dark:border-gray-600 p-4 md:p-5 flex items-center justify-between z-10 shrink-0 bg-white dark:bg-[#374151]">
        <div className="text-left">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">Verificação</h2>
        </div>
        <div className="text-right">
          <span className="text-xs md:text-sm font-bold text-primary dark:text-white bg-blue-50 dark:bg-primary/20 py-1.5 px-3 md:px-4 rounded-full">
            Currículo {currentIndex + 1}/{resumes.length}
          </span>
        </div>
      </div>

      {/* Layout Principal: Coluna no Mobile, Linha no Desktop */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden relative bg-gray-50 dark:bg-[#1A1A36]">
        
        {/* Lado Esquerdo: Formulário de Edição */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-[#374151] p-5 md:p-8 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-600 custom-scrollbar shrink-0 lg:shrink">
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            
            {/* Seção: Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-white border-b border-gray-100 dark:border-gray-600 pb-2 mb-4">
                Informações Pessoais
              </h3>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Nome Completo</label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    value={currentResume.name_candidate || ""}
                    onChange={(e) => handleInputChange("name_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1 block">E-mail</label>
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="email"
                    value={currentResume.email_candidate || ""}
                    onChange={(e) => handleInputChange("email_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Telefone</label>
                <div className="relative flex items-center">
                  <Phone size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    value={currentResume.phone_candidate || ""}
                    onChange={(e) => handleInputChange("phone_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Dados Profissionais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-white border-b border-gray-100 dark:border-gray-600 pb-2 mb-4">
                Perfil Profissional
              </h3>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Formação Acadêmica</label>
                <div className="relative flex items-start">
                  <GraduationCap size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    rows={2}
                    value={currentResume.degree_candidate || ""}
                    onChange={(e) => handleInputChange("degree_candidate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-colors"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1 block">Resumo do Perfil gerado pela IA</label>
                <textarea
                  rows={6}
                  value={currentResume.profile_candidate || ""}
                  onChange={(e) => handleInputChange("profile_candidate", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Visualizador de PDF Permanente */}
        {/* Altura mínima de 500px no mobile para o PDF não sumir, altura total no PC */}
        <div className="w-full lg:w-1/2 min-h-125 lg:min-h-0 h-full bg-[#525659] dark:bg-[#121212] flex flex-col items-center justify-center shrink-0">
          {currentResume.resume_archive ? (
            <iframe
              src={`${currentResume.resume_archive.replace("http://", "https://")}#view=FitH&toolbar=0&navpanes=0`}
              title="Visualizador de PDF Original"
              className="w-full h-full border-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-500">
              <FileText size={48} className="mb-4 opacity-50" />
              <p>Nenhum PDF atrelado a este registro.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Ações de Navegação */}
      {/* flex-wrap garante que os botões não se esmaguem em telas muito finas */}
      <div className="border-t border-gray-200 dark:border-gray-600 p-4 md:p-5 flex flex-wrap gap-4 items-center justify-between z-10 shrink-0 bg-white dark:bg-[#374151]">
        <AppButton
          onClick={handlePrev}
          disabled={currentIndex === 0 || isSaving}
          padding="8px 16px"
          fontSize="16px"
          className="flex-1 sm:flex-none justify-center"
        >
          <ChevronLeft size={20} /> Anterior
        </AppButton>

        {isLastResume ? (
          <AppButton 
            onClick={handleFinalize} 
            padding="8px 16px"
            fontSize="16px"
            disabled={isSaving}
            className="flex-1 sm:flex-none justify-center"
          >
            {isSaving ? (
              <> <Loader2 className="mr-2 animate-spin" size={20} /> Salvando... </>
            ) : (
              <> <Save className="mr-2" size={20} /> Finalizar Envio </>
            )}
          </AppButton>
        ) : (
          <AppButton 
            onClick={handleNext} 
            padding="8px 16px" 
            fontSize="16px"
            className="flex-1 sm:flex-none justify-center"
          >
            Próximo <ChevronRight className="ml-2" size={20} />
          </AppButton>
        )}
      </div>
    </div>
  );
};