import { z } from "zod";

// Definindo as regras do jogo
export const resumeSchema = z.object({
  text: z.string().min(1, "Digite algo para a análise"),
  tags: z.undefined(),
});
