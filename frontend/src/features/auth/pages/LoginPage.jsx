import { TextField } from "@mui/material";
import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo_principal-nobg.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/components/loginSchema";
import { loginService } from "../../../services/loginService";

export const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      console.log("Dados enviados:", data);
      const response = await loginService.signIn(data.email, data.password);
      if (response && response.access_token) {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("user_id", response.user_id);
        console.log("Login com sucesso! Crachá guardado.");
        navigate("/");
      }
    } catch (e) {
      console.error("Erro ao fazer login:", e);
      alert("Email ou senha incorretos."); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="bg-white w-[90%] md:w-[40%] rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col p-10 hover:scale-[1.01] transition-transform duration-300">
        <div className="w-full flex justify-center mb-4">
          <img
            src={logo}
            alt="logo"
            className="w-48 h-auto object-contain drop-shadow-lg"
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <div className="w-full flex justify-center mt-6">
            <AppButton
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              sx={{ width: "100%" }}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};
