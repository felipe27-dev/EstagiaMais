import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";

export default function CardHome() {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`bg-white dark:bg-[#404040]  w-[40%] rounded-3xl border border-gray-200
            card-border-glow shadow-xl overflow-hidden items-center justify-center  flex-col flex-cols-1 p-10 hover:scale-[1.05] transition-transform`}
      >
        <div className="w-full flex justify-center">
          <p className="text-3xl! font-bold! text-primary dark:text-white mb-4">
            {" "}
            Seja bem-vindo ao Estagia+ !
          </p>
        </div>
        <div className="w-full flex justify-center mt-3 gap-4 flex-col">
          <AppButton
            children="Fazer Análise de Curricúlo"
            color="secondary"
            onClick={() => navigate("/search-resume")}
          />
          <AppButton
            children="Enviar Currículos ao Banco"
            color="primary"
            onClick={() => navigate("/send-resumes-database")}
          />
          <AppButton
            children="Acessar Banco"
            color="action"
            onClick={() => navigate("/access-resume")}
          />
        </div>
      </div>
    </>
  );
}
