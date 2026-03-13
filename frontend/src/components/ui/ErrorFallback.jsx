import { AppButton } from "./AppButton";

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-10 text-center bg-white dark:bg-[#374151]  rounded-[2.5rem] shadow-xl border border-red-50 m-6">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🛠️</span>
      </div>
      <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
        Um erro foi encontrado!
      </h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        Ocorreu um erro inesperado nesta página. Não se preocupe, o restante do
        sistema continua funcionando.
      </p>

      {/* Detalhe técnico visível apenas em desenvolvimento */}
      <div className="bg-gray-50 p-4 rounded-2xl mb-8 w-full max-w-md border border-gray-100 overflow-hidden">
        <code className="text-xl text-red-500 break-all">{error.message}</code>
      </div>

      <AppButton onClick={resetErrorBoundary} padding="10px 12px" radius="10px">
        Recarregar Página
      </AppButton>
    </div>
  );
};
