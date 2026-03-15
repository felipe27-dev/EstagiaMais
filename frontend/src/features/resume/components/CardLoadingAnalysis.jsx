import { IoDocumentTextSharp } from "react-icons/io5";
import { motion } from "framer-motion";

export const CardLoadingAnalysis = ({
  isCompleted,
  contentLoad = "Análise em andamento...",
  contentFinished = "Análise concluída!",
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#374151] w-[90%] sm:w-[80%] md:w-125 max-w-lg rounded-3xl border border-gray-200
            card-border-glow shadow-xl overflow-hidden items-center justify-center 
            text-center flex flex-col p-6 md:p-10 mt-4 md:-mt-40 transition-transform hover:scale-[1.02]`}
    >
      <div className="w-full flex justify-center flex-col text-center items-center">
        {/* Título Responsivo */}
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary dark:text-white mb-6 leading-tight">
          {isCompleted ? contentFinished : contentLoad}
        </p>

        {/* Ícone pulando */}
        <motion.div
          className="-mb-3"
          animate={{ y: isCompleted ? 0 : [0, -20, 0] }}
          transition={{
            duration: 1.5,
            repeat: isCompleted ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <IoDocumentTextSharp size={80} className="text-primary dark:text-white" />
        </motion.div>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden relative mt-6">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: isCompleted ? "100%" : "85%",
            }}
            transition={{
              duration: isCompleted ? 0.5 : 15,
              ease: "easeOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};