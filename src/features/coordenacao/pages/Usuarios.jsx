import React, { useState } from "react";

export default function Usuarios() {
  const [activeTab, setActiveTab] = useState("todos");

  const usuarios = [
    { nome: "Ana Silva", email: "ana.silva@senac.edu.br", role: "Professor", status: "Ativo", acesso: "Há 2 horas" },
    { nome: "Carlos Eduardo", email: "carlos.edu@aluno.senac.br", role: "Aluno", status: "Ativo", acesso: "Há 5 min" },
    { nome: "Tech Solutions Inc.", email: "contato@techsolutions.com", role: "Empresa", status: "Ativo", acesso: "Ontem" },
    { nome: "Mariana Costa", email: "mariana.c@aluno.senac.br", role: "Aluno", status: "Inativo", acesso: "Há 15 dias" },
  ];

  const filtrados = activeTab === "todos" ? usuarios : usuarios.filter(u => u.role.toLowerCase() === activeTab);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-sm text-gray-500 mt-1">Administre professores, alunos e empresas parceiras</p>
        </div>
        <button className="bg-[#f19f17] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm">
          + Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center gap-6 px-6 pt-4 border-b border-gray-100 overflow-x-auto">
          {["todos", "professor", "aluno", "empresa"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold capitalize transition-colors relative whitespace-nowrap ${
                activeTab === tab ? "text-[#f19f17]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f19f17] rounded-t-full"></div>}
            </button>
          ))}
        </div>

        <div className="p-4 flex items-center gap-4 border-b border-gray-50 bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar usuário por nome ou email..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 focus:border-[#f19f17] rounded-xl text-sm outline-none transition-colors shadow-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="py-4 px-6 font-semibold">Usuário</th>
                <th className="py-4 px-6 font-semibold">Tipo</th>
                <th className="py-4 px-6 font-semibold">Último Acesso</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{u.nome}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{u.acesso}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${u.status === "Ativo" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
