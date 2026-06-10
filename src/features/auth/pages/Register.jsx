import React from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex font-sans antialiased">
      {/* LADO ESQUERDO: BANNER */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FCFAF7] p-16 flex-col justify-center items-center border-r border-gray-100">
        <div className="max-w-md w-full flex flex-col items-start">
          <div className="w-56 h-28 bg-[#f19f17] rounded-3xl flex items-center justify-center text-white text-5xl shadow-md mb-8">
            🎓
          </div>
          <h1 className="text-4xl font-bold text-[#1E293B] tracking-tight mb-4 text-left">
            Junte-se ao Scripta
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            Escolha seu perfil e faça parte da nossa comunidade acadêmica.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: SELEÇÃO DE PERFIL */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Criar uma conta
            </h2>
            <p className="text-sm text-gray-400">
              Selecione o tipo de perfil que deseja criar
            </p>
          </div>

          <div className="space-y-4">
            {/* OPÇÃO ALUNO */}
            <div
              onClick={() => navigate("/cadastro/aluno")}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-[#f19f17] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-xl group-hover:bg-[#f19f17] group-hover:text-white transition-colors">
                👩‍🎓
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Aluno</h3>
                <p className="text-xs text-gray-500">
                  Submeter e gerenciar projetos
                </p>
              </div>
            </div>

            {/* OPÇÃO PROFESSOR */}
            <div
              onClick={() => navigate("/cadastro/professor")}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-[#f19f17] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                👨‍🏫
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Professor</h3>
                <p className="text-xs text-gray-500">
                  Avaliar projetos e ranking
                </p>
              </div>
            </div>

            {/* OPÇÃO EMPRESA */}
            <div
              onClick={() => navigate("/cadastro/empresa")}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-[#f19f17] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                🏢
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Empresa Parceira
                </h3>
                <p className="text-xs text-gray-500">
                  Explorar projetos e talentos
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-[#f19f17] hover:underline font-semibold"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
