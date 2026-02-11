import { z } from "zod";

// Definindo as regras do jogo
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Inferindo o tipo automaticamente (para TypeScript futuro/IntelliSense)
// export type LoginFormData = z.infer<typeof loginSchema>;