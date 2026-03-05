import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  FileText,
  Save,
} from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";

// Mock de dados da IA
const mockParsedResumes = [
  {
    id: "req_1",
    name: "Carlos Eduardo Silva",
    email: "carlos.silva@email.com",
    phone: "(11) 98765-4321",
    role: "Desenvolvedor Front-end",
    skills: "React, JavaScript, Tailwind, Git",
    experience: "3 anos como desenvolvedor web criando interfaces responsivas.",
  },
  {
    id: "req_2",
    name: "Ana Cláudia Souza",
    email: "ana.souza@email.com",
    phone: "(21) 99999-1111",
    role: "Engenheira de Software Pleno",
    skills: "Node.js, Python, PostgreSQL, AWS",
    experience:
      "Desenvolvimento de APIs RESTful e arquitetura de microserviços.",
  },
];

export const ResumeVerificationFlow = ({ uploadedFiles = [] }) => {
  const [resumes, setResumes] = useState(mockParsedResumes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);

  const currentResume = resumes[currentIndex];
  const isLastResume = currentIndex === resumes.length - 1;

  // Efeito para gerar e limpar a URL do PDF conforme mudamos de currículo
  useEffect(() => {
    if (uploadedFiles.length > 0 && uploadedFiles[currentIndex]) {
      const file = uploadedFiles[currentIndex];
      const url = URL.createObjectURL(file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPdfUrl(url);

      // Limpeza de memória
      return () => URL.revokeObjectURL(url);
    } else {
      setPdfUrl(null); // Reseta a URL se não houver arquivo correspondente
    }
  }, [currentIndex, uploadedFiles]);

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

  const handleNext = () => {
    if (isLastResume) setIsFinished(true);
    else setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center animate-fade-in">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Revisão Concluída!
        </h2>
        <p className="text-gray-600 mb-8">
          Todos os currículos foram verificados e adicionado ao banco de dados.
        </p>
        <AppButton
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
          padding="10px 20px"
          className=" bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all"
        >
          Voltar para o Início
        </AppButton>
      </div>
    );
  }

  return (
    // Altura fixa grande para comportar bem o PDF e o scroll do formulário
    <div className="w-full h-[85vh] bg-white mb-10 rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col animate-fade-in">
      {/* Cabeçalho */}
      <div className="bg-gray-50 border-b border-gray-200 p-5 flex items-center justify-between z-10 shrink-0">
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-800">Verificação</h2>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-blue-600 bg-blue-100 py-1.5 px-4 rounded-full">
            Currículo {currentIndex + 1}/{resumes.length}
          </span>
        </div>
      </div>

      {/* Layout Principal Dividido (50/50 Permanente) */}
      <div className="flex flex-1 overflow-hidden relative bg-gray-100">
        {/* Lado Esquerdo: Formulário de Edição */}
        <div className="w-1/2 bg-white p-8 overflow-y-auto border-r border-gray-200 custom-scrollbar">
          <div className="grid grid-cols-1 gap-8">
            {/* Seção: Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">
                Informações Pessoais
              </h3>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Nome Completo
                </label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    value={currentResume.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  E-mail
                </label>
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="email"
                    value={currentResume.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Telefone
                </label>
                <div className="relative flex items-center">
                  <Phone size={18} className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    value={currentResume.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Dados Profissionais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">
                Perfil Profissional
              </h3>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Habilidades Principais
                </label>
                <div className="relative flex items-start">
                  <GraduationCap
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <textarea
                    rows={2}
                    value={currentResume.skills}
                    onChange={(e) =>
                      handleInputChange("skills", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Resumo do Curriculo/Anotações{" "}
                </label>
                <textarea
                  rows={6}
                  value={currentResume.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Visualizador de PDF Permanente */}
        <div className="w-1/2 h-full bg-[#525659] flex flex-col items-center justify-center">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#view=FitH&toolbar=0&navpanes=0`}
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
      <div className="bg-gray-50 border-t border-gray-200 p-5 flex items-center justify-between z-10 shrink-0">
        <AppButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          padding="4px 18px"
        >
          <ChevronLeft size={20} /> Anterior
        </AppButton>

        <AppButton onClick={handleNext} padding="4px 18px">
          {isLastResume ? (
            <>
              <Save className="mr-2" size={20} /> Finalizar Envio
            </>
          ) : (
            <>
              Próximo <ChevronRight className="ml-2" size={20} />
            </>
          )}
        </AppButton>
      </div>
    </div>
  );
};
