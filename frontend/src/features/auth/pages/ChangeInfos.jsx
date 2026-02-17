import Header from "@/components/layout/Header";
import { TextField } from "@mui/material";
import { AppButton } from "@/components/ui/AppButton";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const updateSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // O erro aparecerá neste campo
  });

export const ChangeInfos = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue, // Usado para preencher os dados iniciais
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    // Exemplo: const user = await api.get('/me');
    // setValue("name", user.name);
    // setValue("email", user.email);
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      console.log("Dados de atualização:", data);
      /*
      // Envia para a rota de atualização (ajuste conforme seu backend)
      await api.put("/users/update", {
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      alert("Dados atualizados com sucesso!"); */
      navigate("/"); // Volta para a home/dashboard
    } catch (e) {
      console.error("Erro ao atualizar:", e);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex justify-center items-center bg-background pt-20">
        <div className="bg-white w-[70%] max-w-[600px] rounded-3xl border border-gray-200 shadow-xl p-10  hover:shadow-2xl transition-all duration-300 flex flex-col items-center animate-fade-in">
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
              />
            </div>

            <div className="w-full flex flex-col md:flex-row justify-center mt-6 gap-4">
              {/* Botão Cancelar (UX melhorada) */}
              <AppButton
                variant="outlined"
                color="action"
                type="button"
                onClick={() => navigate("/")}
                sx={{ width: "100%" }}
              >
                Cancelar
              </AppButton>

              {/* Botão Salvar */}
              <AppButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
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
