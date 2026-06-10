import React from "react";

export default function RealizarAvaliacao() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-700">
      {/* BARRA LATERAL MODERNA (MENU) */}
      <div className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-8 bg-[#f19f17] rounded-lg flex items-center justify-center text-white font-bold">
              🎓
            </div>
            <span className="text-xl font-bold text-gray-900">Scripta</span>
          </div>

          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-600 font-semibold rounded-xl text-sm transition-all"
            >
              <span>📝</span> Avaliar Projetos
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl text-sm font-medium transition-all"
            >
              <span>📜</span> Histórico de Notas
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl text-sm font-medium transition-all"
            >
              <span>📊</span> Visualizar Ranking
            </a>
          </nav>
        </div>

        <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">
          Logado como:{" "}
          <span className="font-semibold text-gray-600 block">
            Prof. Orientador
          </span>
        </div>
      </div>

      {/* ÁREA CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-8 md:p-12 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Avaliação de Projetos
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Selecione o conceito técnico e digite o parecer para o projeto
            recebido.
          </p>
        </div>

        {/* Card Exibindo Dados do Projeto Enviado pelo Aluno */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-[#f19f17] rounded-md uppercase tracking-wider">
              Aguardando Nota
            </span>
            <h3 className="text-lg font-bold text-gray-800 mt-2">
              Plataforma E-commerce para Artesãos Locais
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Submetido por: Gabriel Vasconcelos • Engenharia de Software
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-xl transition-all"
          >
            🌐 Acessar GitHub ↗
          </a>
        </div>

        {/* Formulário de Avaliação Moderna */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Atribuir Conceito
              </label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-600">
                <option value="">Selecione a menção acadêmica...</option>
                <option value="A">Conceito A — Excelente</option>
                <option value="B">Conceito B — Muito Bom</option>
                <option value="C">Conceito C — Regular</option>
                <option value="D">Conceito D — Reprovado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Critério Principal
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl text-sm">
                Projeto Integrador II
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Parecer Descritivo (Feedback Técnico)
            </label>
            <textarea
              rows="5"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder-gray-300 resize-none"
              placeholder="Justifique o conceito com base nas diretrizes técnicas de arquitetura, código e entrega..."
            />
          </div>

          {/* Botão de Ação Principal em Roxo (para dar identidade ao perfil do professor) */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
            >
              Salvar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
