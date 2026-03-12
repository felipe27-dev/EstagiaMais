import { IoMdMenu } from "react-icons/io";
import { Popover } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "@/components/ui/AppButton";
import { IoDocument } from "react-icons/io5";

// 1. Sub-componente: Gerencia o estado visual de UM card individualmente
const ResumeCard = ({ curriculo, onSelect, renderMenuOptions }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  //const handleOptionClick = (action) => { handleCloseMenu(); if (action) action(); };

  return (
    <div className="w-40 h-fit py-6  bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow m-2 flex items-center justify-center flex-col relative border border-gray-100">
      <div className="absolute top-2 right-2">
        <IoMdMenu
          size={24}
          className="text-gray-400 hover:text-primary cursor-pointer transition-colors"
          onClick={handleOpenMenu}
        />
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            style: { padding: "8px", borderRadius: "12px", minWidth: "120px" },
          }}
        >
          <div className="flex flex-col text-md text-gray-600">
            {renderMenuOptions && renderMenuOptions(curriculo, handleCloseMenu)}
          </div>
        </Popover>
      </div>
      <div className="mt-4" onClick={() => onSelect(curriculo)}>
        <IoDocument
          size={80}
          className="text-primary hover:text-action cursor-pointer hover:scale-105 transition-transform duration-200"
        />
      </div>
      {/*tag com o score da análise*/}
      {curriculo.score && (<p className="p-2 bg-primary text-md font-bold text-white rounded-2xl m-2 mb-0">Nota: {curriculo.score}/100</p>)}
      <div className="px-2 mt-3 w-full text-center text-wrap">
        <p
          className="text-primary text-md font-bold truncate w-full"
          title={curriculo.name_candidate}
        >
          {curriculo.name_candidate}
        </p>
      </div>
    </div>
  );
};

// 2. Componente Principal: Apenas renderiza a lista
export const CardShowResumes = ({
  curriculos,
  handleCloseResumes,
  renderMenuOptions,
}) => {
  const navigate = useNavigate();
// Substitua a sua função handleSelectResume por esta:
  const handleSelectResume = (curriculo) => {
    // Salva o currículo completo (com score e feedback da IA) na memória
    localStorage.setItem(`resume_data_${curriculo.id}`, JSON.stringify(curriculo));
    
    // Abre o currículo em uma nova guia, mantendo o Dashboard intacto na guia original!
    window.open(`/resume/${curriculo.id}`, "_blank");
  };
  console.log(curriculos);
  //mostra o map do curriculos
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Grid de Cards */}
      <div className="w-full bg-background/50 rounded-xl flex flex-wrap content-start gap-4 overflow-y-auto p-4 max-h-82.5 scrollbar-thin scrollbar-thumb-gray-300">
        {curriculos.map((curriculo, index) => (
         
          <ResumeCard
            key={curriculo.id || index} // Use ID se possível, index é fallback
            index={index}
            curriculo={curriculo}
            onSelect={handleSelectResume}
            renderMenuOptions={renderMenuOptions}
          />
        ))}

        {curriculos.length === 0 && (
          <div className="w-full text-center py-20 text-gray-400">
            Nenhum currículo encontrado.
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <AppButton
          onClick={handleCloseResumes}
          padding="8px 32px"
          fontSize="16px"
        >
          Voltar
        </AppButton>
      </div>
    </div>
  );
};
