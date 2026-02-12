import { IoDocumentTextSharp } from "react-icons/io5";
import { motion } from "framer-motion";

export const CardLoadingAnalysis = ({ isCompleted }) => {
  return (
    <div
      className={`bg-white w-[40%] rounded-3xl border border-gray-200
            card-border-glow shadow-xl overflow-hidden items-center justify-center 
            text-center flex flex-col p-10 transition-transform hover:scale-[1.02]`}
    >
      <div className="w-full flex justify-center flex-col text-center items-center">
        <p className="text-3xl font-bold text-primary mb-6">
          {isCompleted ? "Finalizando análise..." : "Análise em andamento..."}
        </p>

        {/* Ícone pulando */}
        <motion.div
          className="-mb-3"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <IoDocumentTextSharp size={80} className="text-primary" />
        </motion.div>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
          <motion.div
            className="bg-primary h-full rounded-full"
            // Se estiver completo, vai para 100%. Se não, fica num loop entre 10% e 90%
            animate={{
              width: isCompleted ? "100%" : ["10%", "60%", "80%", "90%"],
            }}
            transition={{
              duration: isCompleted ? 1 : 4, // Rápido se completou, lento se não
              ease: "easeInOut",
              repeat: isCompleted ? 0 : Infinity, // Para de repetir se completou
              repeatType: "mirror",
            }}
          />
        </div>
      </div>
    </div>
  );
};
