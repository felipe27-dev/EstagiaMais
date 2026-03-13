import { forwardRef } from "react";
import { IoClose, IoLogoWhatsapp } from "react-icons/io5";
import { SiGmail } from "react-icons/si";
import { MdDownload } from "react-icons/md";

const ShareButton = ({ children, onClick, colorHover }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-transform hover:scale-110 duration-200 ease-in-out text-primary dark:text-white ${colorHover}`}
    type="button"
  >
    {children}
  </button>
);

// 1. Usamos forwardRef para permitir que o Material UI controle esse componente
export const ShareModal = forwardRef(
  ({ onCloseModal, id, onDownload, onShare }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            bg-white dark:bg-[#404040]  w-[90%] max-w-125 rounded-2xl shadow-2xl border border-gray-200 
            p-8 flex flex-col items-center justify-center text-center outline-none animate-fade-in-up"
      >
        <button
          onClick={onCloseModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Fechar"
        >
          <IoClose size={24} />
        </button>

        <h1 className="text-3xl font-bold text-primary dark:text-white mb-6">
          Selecione como deseja compartilhar a análise #{id}
        </h1>

        <div className="w-full flex justify-center gap-6 flex-row">
          <ShareButton onClick={onShare}colorHover="hover:text-green-500">
            <IoLogoWhatsapp size={45} />
          </ShareButton>

          <ShareButton onClick={onDownload} colorHover="hover:text-blue-500">
            <MdDownload size={45} />
          </ShareButton>

          <ShareButton onClick={onShare} colorHover="hover:text-red-500">
            <SiGmail size={45} />
          </ShareButton>
        </div>
      </div>
    );
  }
);
