import React from "react";

interface GlobalLoadingProps {
  isLoading: boolean;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-white/30 border-t-[#005CAA] rounded-full animate-spin"></div>

        {/* Texto opcional */}
        <p className="mt-4 text-white font-medium text-lg">
          Carregando...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoading;
