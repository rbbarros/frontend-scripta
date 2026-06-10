import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterProfessor() {
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
            Bem-vindo ao Scripta
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            Acesse a plataforma para avaliar projetos e acompanhar o ranking
            acadêmico.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
        <div className="max-w-md w-full py-8">
          <button
            onClick={() => navigate("/cadastro")}
            className="text-sm text-[#f19f17] hover:underline mb-6 flex items-center gap-1 font-medium"
          >
            &larr; Trocar perfil
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Criar conta como Professor
            </h2>
            <p className="text-sm text-gray-400">
              Preencha os dados para começar
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail institucional
              </label>
              <input
                type="email"
                placeholder="professor@senac.edu.br"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="Crie uma senha segura"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                type="password"
                placeholder="Digite a senha novamente"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f19f17] text-white py-3 rounded-xl font-semibold mt-4 hover:bg-[#d98b14] transition-colors"
            >
              Criar conta
            </button>
          </form>

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
