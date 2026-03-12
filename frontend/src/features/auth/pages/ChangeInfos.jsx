import Header from "@/components/layout/Header";
import { TextField } from "@mui/material";
import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginService } from "../../../services/loginService";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

const updateSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const ChangeInfos = () => {
  const navigate = useNavigate();
  // Estado para controlar se os dados já carregaram (ajuda na UX e no Material UI)
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    reset, // Substituímos o setValue pelo reset
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  const handleGetUser = async() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      try {
        const user = await loginService.getUserById(userId);
        // O reset preenche o formulário todo de uma vez e ajuda o MUI a entender a atualização
        reset({
          name: user.name,
          email: user.email,
          password: "",
          confirmPassword: ""
        });
        setDataLoaded(true);
      } catch (error) {
        console.error("Erro ao buscar usuário", error);
      }
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []); // Removi o handleGetUser do array de dependências para evitar loops infinitos

  const onSubmit = async (data) => {
    try {
        const response = await loginService.updateUser(localStorage.getItem("user_id"), {
        name: data.name,
        email: data.email,
        password: data.password
      });
      alert("Dados atualizados com sucesso!");
      navigate("/");
    } catch (e) {
      alert("Erro ao atualizar os dados.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex justify-center items-center bg-background pt-20">
        <div className="bg-white w-[70%] max-w-150 rounded-3xl border border-gray-200 shadow-xl p-10  hover:shadow-2xl transition-all duration-300 flex flex-col items-center animate-fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Atualizar Dados
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full"
          >
            {/* Campo Nome */}
            <TextField
              id="name"
              label="Nome Completo"
              variant="outlined"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              // Força a label a ficar para cima
              InputLabelProps={{ shrink: true }} 
            />

            {/* Campo Email */}
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              // Força a label a ficar para cima
              InputLabelProps={{ shrink: true }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campo Senha */}
              <TextField
                id="password"
                label="Nova Senha"
                variant="outlined"
                type="password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputLabelProps={{ shrink: true }}
              />

              {/* Campo Confirmar Senha */}
              <TextField
                id="confirmPassword"
                label="Confirmar Senha"
                variant="outlined"
                type="password"
                fullWidth
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            <div className="w-full flex flex-col md:flex-row justify-center mt-6 gap-4">
              <AppButton
                variant="outlined"
                color="action"
                type="button"
                onClick={() => navigate("/")}
                sx={{ width: "100%" }}
              >
                Cancelar
              </AppButton>

              <AppButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting || !dataLoaded} // Bloqueia salvar antes de carregar
                sx={{ width: "100%" }}
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};