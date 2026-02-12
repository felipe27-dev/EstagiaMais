import Header from "@/components/layout/Header";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/features/resume/components/resumeSchema.js";
import { AppButton } from "@/components/ui/AppButton";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const SearchResume = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resumeSchema),
  });

  const onSubmit = async (data) => {
    data.tags = tags;

    // Simula o delay do envio
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Dados enviados:", data);

    // Gera o ID

    //math.random está depracted
    const id = 2030;

    // Navega para a URL com o ID
    navigate(`/analysis-resume/${id}`);
  };

  const handleKeyDown = (event) => {
    const currentValue = event.target.value;
    if (event.key === "Enter") {
      console.log(currentValue);
      event.preventDefault();
      setTags([...tags, currentValue]);
      event.target.value = "";
    }
  };

  return (
    <>
      <Header />
      <div className="h-screen flex justify-center items-center">
        <div
          className={`bg-white w-[80%] rounded-3xl border border-gray-200
                    card-border-glow shadow-xl overflow-hidden items-center justify-center  flex-col flex-cols-1 p-10 hover:scale-[1.01] transition-transform mt-[6%] pb-6`}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex-col justify-center">
              <h1 className="text-2xl font-bold text-primary mb-4">
                Envie o texto para a busca de currículos
              </h1>
              <TextField
                multiline
                rows={7}
                inputProps={{ style: { fontSize: 18 } }}
                placeholder="Digite o texto aqui"
                {...register("text")}
                error={!!errors.text}
                helperText={errors.text?.message}
              />
            </div>

            <div className="w-full justify-center mt-6 gap-4 flex-col">
              <h1 className="text-2xl font-bold text-primary mb-4">
                Selecione as categorias dos currículos
              </h1>
              <TextField
                inputProps={{ style: { fontSize: 18 } }}
                error={!!errors.tags}
                helperText={errors.tags?.message}
                onKeyDown={handleKeyDown}
                placeholder={
                  tags.length === 0 ? "Digite e aperte Enter..." : ""
                }
                InputProps={{
                  startAdornment: (
                    <div className="flex flex-wrap gap-2 my-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-primary py-1 px-3 rounded-full font-bold text-lg text-white flex items-center gap-1"
                        >
                          {tag}
                          <IoClose
                            size={20}
                            className="cursor-pointer hover:text-gray-200"
                            onClick={() =>
                              setTags(tags.filter((_, i) => i !== index))
                            }
                          />
                        </span>
                      ))}
                    </div>
                  ),
                }}
                sx={{
                  // 2. ISSO É O MAIS IMPORTANTE: Força o container interno do MUI a aceitar quebra de linha
                  "& .MuiInputBase-root": {
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "4px", // Pequeno espaço entre as tags e o input de texto
                  },
                  "& .MuiInputBase-input": {
                    width: "auto", // Faz o campo de texto ocupar apenas o espaço que sobra
                    flexGrow: 1, // Permite que o campo de texto estique na linha atual
                    minWidth: "100px", // Garante que sempre haja um espaço para clicar e digitar
                    fontSize: "18px",
                  },
                }}
              ></TextField>
            </div>
            <div className="w-full flex-col justify-end items-end mt-4 text-right">
              <AppButton
                color="primary"
                type="submit"
                disabled={isSubmitting}
                padding="2px 26px"
                radius="18px"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SearchResume;
