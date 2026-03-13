import { useState, useRef, useCallback } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

export const ResumeUploadForm = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Helper para formatar o tamanho do arquivo para leitura humana
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Lógica centralizada para processar os arquivos selecionados ou arrastados
  const processFiles = useCallback((newFiles) => {
    setError(""); // Limpa erros anteriores

    const validFiles = newFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (validFiles.length !== newFiles.length) {
      setError("Alguns arquivos foram ignorados pois não são PDF.");
    }

    setFiles((prev) => {
      // Evita duplicatas baseadas no nome e tamanho
      const uniqueFiles = validFiles.filter(
        (validFile) =>
          !prev.some(
            (existing) =>
              existing.name === validFile.name &&
              existing.size === validFile.size
          )
      );
      return [...prev, ...uniqueFiles];
    });
  }, []);

  // --- Handlers de Drag & Drop ---
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files));
      }
    },
    [processFiles]
  );

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      onUpload(files); // Passa o array de arquivos para a mutação no componente pai
    }
  };

  return (
    <div className="w-full max-w-2xl mt-[3%] bg-white dark:bg-[#374151]  rounded-2xl shadow-lg border border-gray-100 p-8 m-4 animate-fade-in">
      {/* Header do Form */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-black dark:text-white ">
          Análise de Currículos
        </h2>
      </div>

      {/* Zona de Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group ${
          isDragging
            ? "border-blue-500 bg-blue-50/50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-50/80"
        } dark:bg-[#1E1E1E] hover:dark:bg-[#1E1E1E]/60`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files?.length > 0)
              processFiles(Array.from(e.target.files));
            e.target.value = null; // Reseta input
          }}
        />

        <div
          className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? "bg-blue-100" : "bg-white  shadow-sm group-hover:bg-blue-50"} dark:bg-[#374151]`}
        >
          <UploadCloud
            size={36}
            className={`${isDragging ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"}`}
          />
        </div>

        <p className="text-gray-700 dark:text-white font-medium text-base mb-1">
          Arraste e solte os PDFs aqui ou clique para procurar no seu computador
        </p>
      </div>

      {/* Mensagem de Erro (se houver) */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm border border-amber-100">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-sm font-semibold text-gray-700">
              {files.length} arquivo(s) pronto(s)
            </span>
            <button
              onClick={() => setFiles([])}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Remover todos
            </button>
          </div>

          <ul className="max-h-55 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-white dark:bg-[#374151]  border border-gray-200 rounded-lg shadow-sm hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-red-50 p-2 rounded-md">
                    <FileText size={20} className="text-red-200" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-gray-700 dark:text-white truncate max-w-50 sm:max-w-75">
                      {file.name}
                    </span>
                    <span className="text-xs text-left text-gray-400">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evita acionar o clique da zona de drop se estiver sobreposta
                    removeFile(index);
                  }}
                  className="p-1.5 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                  title="Remover arquivo"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ação Principal */}
      <div className="mt-8">
        <AppButton
          disabled={files.length === 0}
          onClick={handleSubmit}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
            files.length > 0
              ? "bg-primary hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              : "bg-gray-300 cursor-not-allowed opacity-70"
          }`}
        >
          {files.length > 0
            ? `Processar ${files.length} Currículo(s)`
            : "Selecione arquivos para continuar"}
        </AppButton>
      </div>
    </div>
  );
};
