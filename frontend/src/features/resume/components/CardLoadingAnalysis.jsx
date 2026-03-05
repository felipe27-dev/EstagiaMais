import { IoDocumentTextSharp } from "react-icons/io5";
import { motion } from "framer-motion";

export const CardLoadingAnalysis = ({
  isCompleted,
  contentLoad = "Análise em andamento...",
  contentFinished = "Análise concluída!",
}) => {
  return (
    <div
      className={`bg-white w-125 mt-5 rounded-3xl border border-gray-200
            card-border-glow shadow-xl overflow-hidden items-center justify-center 
            text-center flex flex-col p-10 transition-transform hover:scale-[1.02]`}
    >
      <div className="w-full flex justify-center flex-col text-center items-center">
        {/* Título */}
        <p className="text-3xl font-bold text-primary mb-6">
          {isCompleted ? contentFinished : contentLoad}
        </p>

        {/* Ícone pulando (Para de pular quando conclui) */}
        <motion.div
          className="-mb-3"
          animate={{ y: isCompleted ? 0 : [0, -20, 0] }}
          transition={{
            duration: 1.5,
            repeat: isCompleted ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <IoDocumentTextSharp size={80} className="text-primary" />
        </motion.div>

        {/* Barra de Progresso Corrigida */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: isCompleted ? "100%" : "85%",
            }}
            transition={{
              // Se não completou, leva 15s pra chegar em 85% (dá a sensação de processamento longo)
              // Se completou, preenche o resto em meio segundo.
              duration: isCompleted ? 0.5 : 15,
              ease: "easeOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};
