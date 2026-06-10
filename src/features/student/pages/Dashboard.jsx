import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      {/* TÍTULO DA TELA */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Bem-vindo ao Scripta
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Acesse rapidamente suas funcionalidades principais
        </p>
      </div>

      {/* BLOCOS DE ACESSO RÁPIDO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            📤
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">
            Submeter Projeto
          </h3>
          <p className="text-xs text-gray-400">
            Envie seu novo projeto integrador
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            🔍
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">
            Buscar Projetos
          </h3>
          <p className="text-xs text-gray-400">
            Explore projetos de outros alunos
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-[#c67c00] rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            🏆
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Ver Ranking</h3>
          <p className="text-xs text-gray-400">Confira os melhores projetos</p>
        </div>

        {/* Link apontando para a sub-rota de portfólio */}
        <Link
          to="/aluno/portfolio"
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow block text-left"
        >
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            💼
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">
            Meu Portfólio
          </h3>
          <p className="text-xs text-gray-400">
            Gerencie seus projetos publicados
          </p>
        </Link>
      </div>

      {/* CONTEÚDO DE DESTAQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Projetos em Destaque
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">
                Sistema de IA para Diagnóstico Médico
              </h4>
              <span className="text-xs text-gray-400">
                Engenharia de Software • 📅 Há 2 dias
              </span>
            </div>
            <div className="bg-amber-50 text-[#c67c00] px-3 py-1.5 rounded-xl text-xs font-bold">
              🏆 9.8
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Notificações
            </h3>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="bg-amber-50 p-3 rounded-xl text-amber-900 font-medium">
                Novo projeto avaliado
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
