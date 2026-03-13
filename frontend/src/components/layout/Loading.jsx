import { motion } from "framer-motion";

export const EstagiaLoader = () => {
  // Cores do seu tema
  const primaryColor = "#110364"; // Azul profundo
  const secondaryColor = "#F4C300"; // Dourado/Amarelo

  // Configuração da animação de órbita
  const orbitTransition = {
    duration: 2, // Tempo de uma volta completa (segundos)
    repeat: Infinity, // Repete para sempre
    ease: "linear", // Movimento constante, sem acelerar/desacelerar
  };

  return (
    // Container centralizado na tela inteira com fundo suave
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm z-50">
      <div className="relative w-24 h-24 flex items-center justify-center">
        
        {/* --- O CENTRO (+) --- */}
        {/* O "+" que pulsa suavemente */}
        <motion.div
          className="absolute text-4xl font-bold text-primary dark:text-white"
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          +
        </motion.div>

        {/* --- ORBITA 1 (AZUL - Representa a Empresa) --- */}
        {/* Um container invisível que gira */}
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={orbitTransition}
        >
          {/* A bolinha que fica na borda desse container giratório */}
          <span
            className="absolute top-0 left-1/2 w-4 h-4 -ml-2 rounded-full shadow-sm shadow-primary/30"
            style={{ backgroundColor: primaryColor }}
          />
        </motion.div>

        {/* --- ORBITA 2 (DOURADA - Representa o Estagiário) --- */}
        {/* Gira no sentido oposto (-360) e um pouco mais rápido para criar dinamismo */}
        <motion.div
          className="absolute w-16 h-16" // Um pouco menor para orbitar por dentro
          animate={{ rotate: -360 }}
          transition={{ ...orbitTransition, duration: 1.5 }}
        >
           {/* A bolinha dourada deslocada para baixo */}
          <span
            className="absolute bottom-0 left-1/2 w-3 h-3 -ml-1.5 rounded-full shadow-sm shadow-secondary/30"
            style={{ backgroundColor: secondaryColor }}
          />
        </motion.div>
      </div>

      {/* Texto de apoio com animação sutil */}
      <motion.p 
        className="mt-6 text-primary dark:text-white font-semibold text-lg tracking-wide"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Carregando...
      </motion.p>
    </div>
  );
};