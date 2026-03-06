import { z } from "zod";

// Definindo as regras do jogo
export const resumeSchema = z.object({
  text: z.string().min(1, "Digite algo para a análise"),
  tags: z.undefined(),
});

export const resumeEditSchema = z.object({
  name_candidate: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email_candidate: z.string().email("Email inválido"),
  phone_candidate: z.string().optional(),
  degree_candidate: z.string().optional(),
  profile_candidate: z.string().optional(),
});