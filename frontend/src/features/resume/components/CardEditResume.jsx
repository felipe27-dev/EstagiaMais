import { TextField, CircularProgress } from "@mui/material";
import { AppButton } from "@/components/ui/AppButton"; 
import { IoSave, IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeEditSchema } from "./resumeSchema"; 
import { resumeService } from "../../../services/resumeServices"; 

export const CardEditResume = ({ curriculo }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resumeEditSchema),
    values: {
      name_candidate: curriculo?.name_candidate || "",
      email_candidate: curriculo?.email_candidate || "",
      phone_candidate: curriculo?.phone_candidate || "",
      degree_candidate: curriculo?.degree_candidate || "",
      profile_candidate: curriculo?.profile_candidate || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Enviando dados atualizados:", data);
      await resumeService.update(curriculo.id, data);
      alert("Currículo atualizado com sucesso!");
      navigate(-1); 
    } catch (error) {
      console.error("Erro ao atualizar o currículo:", error);
      alert("Falha ao salvar as alterações.");
    }
  };

  if (!curriculo) {
    return (
      <div className="flex justify-center items-center h-full p-20">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#374151] w-[95%] sm:w-[90%] max-w-7xl rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl my-6 mx-auto">
        
        {/* Cabeçalho do Card Responsivo */}
        <div className="w-full border-b border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex flex-col text-center md:text-left w-full md:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
              Editar Currículo
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
            <AppButton
              onClick={() => navigate(-1)}
              color="secondary"
              padding="10px 18px"
              startIcon={<IoArrowBack />}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none justify-center"
            >
              Voltar
            </AppButton>
            
            <AppButton
              color="primary"
              padding="10px 18px"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit"/> : <IoSave />}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none justify-center"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </AppButton>
          </div>
        </div>

        {/* Corpo do Conteúdo */}
        <div className="flex flex-col lg:flex-row w-full h-full">
          
          {/* COLUNA 1: Visualização do Documento (PDF) */}
          <div className="w-full lg:w-1/2 p-4 md:p-8 bg-gray-50 dark:bg-[#1E1E1E] border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700 flex flex-col items-center shrink-0">
            {curriculo.resume_archive && (
              <iframe
                src={(curriculo?.resume_archive?.replace("http://", "https://")) + "#view=FitH&toolbar=0&navpanes=0"}
                className="w-full rounded-xl h-100 md:h-150 border-none"
                title="Visualizador de Currículo"
              >
                <p className="p-10 text-center dark:text-gray-300">
                  Seu navegador não suporta visualização de PDF.
                  <a
                    href={curriculo?.resume_archive}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary dark:text-blue-400 underline ml-1"
                  >
                    Clique aqui para baixar.
                  </a>
                </p>
              </iframe>
            )}
          </div>

          {/* COLUNA 2: Formulário de Edição */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col bg-white dark:bg-[#374151]">
            <h3 className="text-xl md:text-2xl font-bold text-primary dark:text-white mb-6">
              Detalhes do Candidato
            </h3>

            <form id="edit-resume-form" className="flex flex-col gap-5 h-full md:pr-2 custom-scrollbar">
              <TextField
                label="Nome Completo"
                variant="outlined"
                fullWidth
                placeholder="Ex: Felipe de Souza Rosa"
                InputLabelProps={{ shrink: true }}
                {...register("name_candidate")}
                error={!!errors.name_candidate}
                helperText={errors.name_candidate?.message}
              />

              <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("email_candidate")}
                  error={!!errors.email_candidate}
                  helperText={errors.email_candidate?.message}
                />
                <TextField
                  label="Telefone"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("phone_candidate")}
                  error={!!errors.phone_candidate}
                  helperText={errors.phone_candidate?.message}
                />
              </div>

              <TextField
                label="Formação Acadêmica"
                variant="outlined"
                fullWidth
                placeholder="Ex: Sistemas de Informação"
                InputLabelProps={{ shrink: true }}
                {...register("degree_candidate")}
                error={!!errors.degree_candidate}
                helperText={errors.degree_candidate?.message}
              />

              <TextField
                label="Resumo Profissional / Anotações"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                placeholder="Adicione observações sobre este currículo..."
                InputLabelProps={{ shrink: true }}
                {...register("profile_candidate")}
                error={!!errors.profile_candidate}
                helperText={errors.profile_candidate?.message}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};