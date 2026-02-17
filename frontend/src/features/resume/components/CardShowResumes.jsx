import { IoMdMenu } from "react-icons/io";
import { Popover } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "@/components/ui/AppButton";
import { IoDocument } from "react-icons/io5";

export const CardShowResumes = ({ curriculos, handleCloseResumes }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
  };
  const menuItemClass =
    "text-primary p-6 py-2 hover:bg-primary hover:text-white hover:font-bold cursor-pointer transition-colors";

  const handleSelectResume = (idResume) => {
    const curriculoSelected = curriculos[idResume];
    navigate(`/resume/${idResume}`, {
      state: { curriculo: curriculoSelected },
    });
  };

  return (
    <>
      <div className="w-full bg-background rounded-xl flex max-h-90 justify-center flex-row flex-rows-5 flex-wrap gap-[5%] overflow-auto">
        {curriculos.map((curriculo, index) => (
          <div className="w-40 h-40 bg-white rounded-md m-2 flex items-center justify-center flex-col">
            <div className="relative left-1/3 top-2">
              <IoMdMenu
                size={30}
                className="text-primary hover:text-action cursor-pointer"
                onClick={handleMenuClick}
              />
              <Popover
                open={Boolean(menuAnchor)}
                anchorEl={menuAnchor}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <div className="flex flex-col">
                  <p className={menuItemClass}>Retirar</p>
                  <p className={menuItemClass}>Baixar</p>
                </div>
              </Popover>
            </div>
            <div className="m-0 p-0">
              <IoDocument
                size={90}
                className="text-primary hover:text-action cursor-pointer hover:scale-3d"
                onClick={() => handleSelectResume(index)}
              />
            </div>
            <p className="text-primary text-[15px] mb-2 font-bold w-full text-wrap p-1">
              Currículo {index + 1} - {curriculo.nome.slice(0, 15)}
              {curriculo.nome.length > 15 ? "..." : ""}
            </p>{" "}
            {/* Aparece no máximo 15 letras, se tiver mais aparece ... */}
          </div>
        ))}
      </div>
      <AppButton
        onClick={() => {
          handleCloseResumes;
        }}
        className="absolute left-98 -bottom-2"
        padding="4px 20px"
        fontSize="18px"
      >
        Voltar
      </AppButton>
    </>
  );
};
