import { useState } from "react";
import { FaUser, FaEllipsisV } from "react-icons/fa";
import { Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo_principal-nobg.png";

export default function Header({ fixed = true }) {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
  const navigate = useNavigate();

  // Handlers simplificados
  const handleUserClick = (e) => setUserMenuAnchor(e.currentTarget);
  const handleSettingsClick = (e) => setSettingsMenuAnchor(e.currentTarget);

  const handleClose = () => {
    setUserMenuAnchor(null);
    setSettingsMenuAnchor(null);
  };

  const menuItemClass =
    "text-primary p-3 hover:bg-primary hover:text-white hover:font-bold cursor-pointer transition-colors";

  return (
    <header
      className={`w-full ${fixed ? "fixed" : ""} h-22 p-6 px-10 flex items-center justify-between bg-primary z-50 shadow-md`}
    >
      <img
        alt="logo"
        className="w-auto h-12 cursor-pointer hover:opacity-90 transition-opacity"
        src={logo}
        onClick={() => navigate("/")}
      />

      <div className="flex items-center gap-6">
        <FaUser
          className="text-white cursor-pointer hover:text-gray-300"
          size={30}
          onClick={handleUserClick}
        />

        <Popover
          open={Boolean(userMenuAnchor)}
          anchorEl={userMenuAnchor}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <div className="flex flex-col">
            <p
              className={menuItemClass}
              onClick={() => navigate("/recadastro")}
            >
              Mudar Cadastro
            </p>
            <p className={menuItemClass} onClick={() => navigate("/login")}>
              Sair
            </p>
          </div>
        </Popover>

        <FaEllipsisV
          className="text-white cursor-pointer hover:text-gray-300"
          size={30}
          onClick={handleSettingsClick}
        />

        <Popover
          open={Boolean(settingsMenuAnchor)}
          anchorEl={settingsMenuAnchor}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <div className="flex flex-col">
            <p className={menuItemClass}>Alterar Tema</p>
            <p className={menuItemClass}>Guia de Uso</p>
          </div>
        </Popover>
      </div>
    </header>
  );
}
