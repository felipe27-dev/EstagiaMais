import { useState, useRef } from "react";
import { Button, IconButton, Typography } from "@mui/material";
import {
  CloudUpload,
  Delete,
  PictureAsPdf,
  CheckCircle,
} from "@mui/icons-material";

export const ResumeUploadForm = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Manipula a seleção via input tradicional
  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      processFiles(Array.from(event.target.files));
    }
  };

  // Processa e valida os arquivos (Lógica centralizada)
  const processFiles = (newFiles) => {
    const validFiles = newFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (validFiles.length !== newFiles.length) {
      alert("Apenas arquivos PDF são permitidos.");
    }

    // Evita duplicatas baseadas no nome + tamanho
    const uniqueFiles = validFiles.filter(
      (newFile) =>
        !selectedFiles.some(
          (existing) =>
            existing.name === newFile.name && existing.size === newFile.size
        )
    );

    setSelectedFiles((prev) => [...prev, ...uniqueFiles]);
  };

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Remove um arquivo específico da lista
  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Envia para o componente pai
  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  };

  return (
    <div className="bg-white w-full max-w-3xl mx-auto rounded-3xl border border-gray-100 shadow-xl p-8 hover:shadow-2xl transition-all duration-300 flex flex-col items-center animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Upload de Currículos
        </h1>
        <p className="text-gray-500 text-sm">
          Selecione os arquivos PDF para análise da Inteligência Artificial
        </p>
      </div>

      {/* Área de Drag & Drop */}
      <div
        className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
        />

        <CloudUpload
          sx={{ fontSize: 60, color: isDragging ? "#3b82f6" : "#9ca3af" }}
        />

        <Typography variant="h6" className="mt-4 text-gray-700 font-medium">
          Arraste e solte seus PDFs aqui
        </Typography>
        <Typography variant="body2" className="text-gray-400 mt-1">
          ou clique para buscar no computador
        </Typography>
      </div>

      {/* Lista de Arquivos Selecionados */}
      {selectedFiles.length > 0 && (
        <div className="w-full mt-6 space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-600">
              {selectedFiles.length} arquivo(s) selecionado(s)
            </span>
            <Button
              size="small"
              color="error"
              onClick={() => setSelectedFiles([])}
            >
              Limpar tudo
            </Button>
          </div>

          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-red-100 rounded-lg">
                  <PictureAsPdf className="text-red-500" fontSize="small" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-gray-700 truncate block max-w-[200px] sm:max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <Delete
                  fontSize="small"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                />
              </IconButton>
            </div>
          ))}
        </div>
      )}

      {/* Botão de Ação Principal */}
      <div className="w-full mt-8">
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={selectedFiles.length === 0}
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: "bold",
            boxShadow: "none",
            backgroundColor: selectedFiles.length > 0 ? "" : "#e5e7eb", // Cinza se desabilitado
          }}
        >
          {selectedFiles.length > 0
            ? `Analisar ${selectedFiles.length} Currículo(s)`
            : "Aguardando arquivos..."}
        </Button>
      </div>
    </div>
  );
};
