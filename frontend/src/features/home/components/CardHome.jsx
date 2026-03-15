import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";

export default function CardHome() {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white dark:bg-[#374151] w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-w-2xl rounded-3xl border border-gray-200
          card-border-glow shadow-xl overflow-hidden flex flex-col items-center justify-center p-6 md:p-10 hover:scale-[1.02] md:hover:scale-[1.05] transition-transform`}
    >
      <div className="w-full flex justify-center text-center">
        <p className="text-2xl! md:text-3xl! font-bold! text-primary dark:text-white mb-4 leading-tight">
          Seja bem-vindo ao Estagia+ !
        </p>
      </div>
      <div className="w-full flex justify-center mt-3 gap-3 md:gap-4 flex-col">
        <AppButton
          color="secondary"
          onClick={() => navigate("/search-resume")}
        >
          Fazer Análise de Currículo
        </AppButton>
        <AppButton
          color="primary"
          onClick={() => navigate("/send-resumes-database")}
        >
          Enviar Currículos ao Banco
        </AppButton>
        <AppButton
          color="action"
          onClick={() => navigate("/access-resume")}
        >
          Acessar Banco
        </AppButton>
      </div>
    </div>
  );
}