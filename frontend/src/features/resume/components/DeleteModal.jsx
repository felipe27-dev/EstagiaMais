import { IoClose, IoTrashBin, IoWarning } from "react-icons/io5";
import { forwardRef } from "react";
import { AppButton } from "@/components/ui/AppButton"; // Supondo que você tenha este componente

export const DeleteModal = forwardRef(
  ({ onCloseModal, id, onConfirm }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-white w-[90%] max-w-[450px] rounded-2xl shadow-2xl border border-gray-200 
        p-8 flex flex-col items-center justify-center text-center outline-none animate-fade-in-up"
      >
        {/* Botão Fechar (Topo Direita) */}
        <button
          onClick={onCloseModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Fechar"
        >
          <IoClose size={24} />
        </button>

        {/* Títulos e Textos */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2 pt-3 text-left">
          Tem certeza que quer excluir o currículo?
        </h1>

        <p className="text-gray-500 mb-8 text-sm leading-relaxed text-left">
          Você está prestes a remover o currículo{" "}
          <span className="font-bold text-gray-700">#{id}</span>.
          <br />
          Essa ação é irreversível e os dados serão perdidos permanentemente.
        </p>

        {/* Botões de Ação */}
        <div className="w-full flex gap-3">
          {/* Botão Cancelar (Secundário) */}
          <button
            onClick={onCloseModal}
            className="flex-1 py-3 cursor-pointer px-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 cursor-pointer px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <IoWarning size={18} />
            Deletar
          </button>
        </div>
      </div>
    );
  }
);

// Boa prática para debug
DeleteModal.displayName = "DeleteModal";
