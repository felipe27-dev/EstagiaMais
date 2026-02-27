import { TextField } from "@mui/material";
import { AppButton } from "@/components/ui/AppButton"; // Supondo que você tenha esse componente
import { IoSave, IoArrowBack, IoDocumentText } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const CardEditResume = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white w-[90%] max-w-7xl rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
        {/* Cabeçalho do Card */}
        <div className="w-full border-b border-gray-100 p-8 flex justify-between items-center bg-gray-50/50">
          <div className="flex flex-col text-left">
            <h1 className="text-3xl font-bold text-primary ">
              Editar Currículo
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Atualize as informações do candidato e salve as alterações.
            </p>
          </div>
          <div className="flex gap-3">
            <AppButton
              onClick={() => navigate(-1)}
              color="secondary"
              padding="10px 18px"
              startIcon={<IoArrowBack />}
            >
              Voltar
            </AppButton>
            <AppButton
              color="primary"
              padding="10px 18px"
              startIcon={<IoSave />}
            >
              Salvar Alterações
            </AppButton>
          </div>
        </div>

        {/* Corpo do Conteúdo (Grid Responsivo) */}
        <div className="flex flex-col lg:flex-row w-full h-full">
          {/* COLUNA 1: Visualização do Documento (PDF) */}
          <div className="w-full lg:w-1/2 p-8 bg-gray-50 border-r border-gray-100 flex flex-col items-center">
            {/* Container do PDF/Placeholder */}
            <div className="w-full h-[600px] bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
              {/* Aqui viria seu <iframe src={pdfUrl} ... /> */}
              <div className="text-center p-6">
                <p className="text-gray-500 font-medium">
                  Pré-visualização do Documento
                </p>
                <p className="text-gray-400 text-sm">
                  O arquivo PDF será renderizado aqui.
                </p>
              </div>

              {/* Efeito visual apenas para dar acabamento */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </div>
          </div>

          {/* COLUNA 2: Formulário de Edição */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col ">
            <h3 className="text-2xl font-bold text-primary mb-6">
              Detalhes do Candidato
            </h3>

            <form className="flex flex-col gap-5 h-full pr-2 custom-scrollbar">
              {/* Linha 1: Nome Completo */}
              <TextField
                label="Nome Completo"
                variant="outlined"
                fullWidth
                placeholder="Ex: Felipe de Souza Rosa"
                InputLabelProps={{ shrink: true }}
              />

              {/* Linha 2: Cargo e Empresa (Lado a Lado) */}
              <div className="flex flex-col md:flex-row gap-4 ">
                <TextField
                  label="Cargo Atual"
                  variant="outlined"
                  fullWidth
                  placeholder="Ex: Desenvolvedor Web"
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              {/* Linha 3: Contatos */}
              <div className="flex flex-col md:flex-row gap-4">
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Telefone"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              {/* Linha 4: Formação Acadêmica */}
              <TextField
                label="Formação Acadêmica"
                variant="outlined"
                fullWidth
                placeholder="Ex: Sistemas de Informação"
                InputLabelProps={{ shrink: true }}
              />

              {/* Linha 5: Resumo (Multiline) */}
              <TextField
                label="Resumo Profissional / Anotações"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                placeholder="Adicione observações sobre este currículo..."
                InputLabelProps={{ shrink: true }}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
