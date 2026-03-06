import { TextField, CircularProgress } from "@mui/material";
import { AppButton } from "@/components/ui/AppButton"; 
import { IoSave, IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeEditSchema } from "./resumeSchema"; // Ajuste o caminho
import { resumeService } from "../../../services/resumeServices"; // Ajuste o caminho

export const CardEditResume = ({ curriculo }) => {
  const navigate = useNavigate();

 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resumeEditSchema),
    // TROQUE "defaultValues" POR "values"
    // Isso avisa o hook-form para atualizar a tela quando o "curriculo" chegar da API
    values: {
      name_candidate: curriculo?.name_candidate || "",
      email_candidate: curriculo?.email_candidate || "",
      phone_candidate: curriculo?.phone_candidate || "",
      degree_candidate: curriculo?.degree_candidate || "",
      profile_candidate: curriculo?.profile_candidate || "",
    },
  });
  
  // 3. Função disparada ao clicar em Salvar
  const onSubmit = async (data) => {
    try {
      console.log("Enviando dados atualizados:", data);
      
      // Chama o PUT no seu backend
      await resumeService.update(curriculo.id, data);
      
      alert("Currículo atualizado com sucesso!");
      navigate(-1); // Volta para a tela anterior
      
    } catch (error) {
      console.error("Erro ao atualizar o currículo:", error);
      alert("Falha ao salvar as alterações.");
    }
  };

  return (
    <>
      <div className="bg-white w-[90%] max-w-7xl rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
        {/* Cabeçalho do Card */}
        <div className="w-full border-b border-gray-100 p-8 flex justify-between items-center bg-gray-50/50">
          <div className="flex flex-col text-left">
            <h1 className="text-3xl font-bold text-primary ">
              Editar Currículo
            </h1>
          </div>
          <div className="flex gap-3">
            <AppButton
              onClick={() => navigate(-1)}
              color="secondary"
              padding="10px 18px"
              startIcon={<IoArrowBack />}
              disabled={isSubmitting}
            >
              Voltar
            </AppButton>
            
            {/* O botão agora submete o formulário referenciado abaixo */}
            <AppButton
              color="primary"
              padding="10px 18px"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit"/> : <IoSave />}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </AppButton>
          </div>
        </div>

        {/* Corpo do Conteúdo (Grid Responsivo) */}
        <div className="flex flex-col lg:flex-row w-full h-full">
          {/* COLUNA 1: Visualização do Documento (PDF) */}
          <div className="w-full lg:w-1/2 p-8 bg-gray-50 border-r border-gray-100 flex flex-col items-center">
            {/* Container do PDF/Placeholder */}
            <div className="w-full h-[500px] bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
              {/* iframe mockado para uso futuro */}
              <div className="text-center p-6">
                <p className="text-gray-500 font-medium">
                  Pré-visualização do Documento
                </p>
                <p className="text-gray-400 text-sm">
                  O arquivo PDF será renderizado aqui.
                </p>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </div>
          </div>

          {/* COLUNA 2: Formulário de Edição */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col ">
            <h3 className="text-2xl font-bold text-primary mb-6">
              Detalhes do Candidato
            </h3>

            {/* Removemos o onSubmit daqui porque o botão de salvar está fora do <form> no cabeçalho */}
            <form id="edit-resume-form" className="flex flex-col gap-5 h-full pr-2 custom-scrollbar">
              
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

              <div className="flex flex-col md:flex-row gap-4">
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