import React from "react";

export default function Certificados() {
  const certificados = [
    { projeto: "Sistema de IA para Diagnóstico Médico", alunos: "João Silva, Maria Santos +2", status: "Emitido", data: "28/05/2025" },
    { projeto: "Plataforma de Blockchain", alunos: "Pedro Costa, Ana Lima +1", status: "Pendente", data: "25/05/2025" },
    { projeto: "App de Mobilidade Urbana", alunos: "Lucas Pereira, Júlia Mendes", status: "Pendente", data: "22/05/2025" },
    { projeto: "Dashboard de Dados Educacionais", alunos: "Roberto Alves, Carla Dias", status: "Emitido", data: "15/05/2025" },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Emissão de Certificados</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie e emita certificados para projetos aprovados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Certificados Emitidos</p>
            <p className="text-3xl font-bold text-gray-900">342</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Aguardando Emissão</p>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Tempo Médio</p>
            <p className="text-3xl font-bold text-gray-900">2 <span className="text-lg text-gray-500 font-medium">dias</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm px-2">Lista de Certificados</h3>
          <div className="flex gap-2">
            <button className="text-sm font-bold text-[#f19f17] border border-[#f19f17] rounded-xl px-4 py-2 hover:bg-amber-50 transition-colors">
              Emitir em lote (2)
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="py-4 px-6">Projeto</th>
                <th className="py-4 px-6">Alunos</th>
                <th className="py-4 px-6">Data Aprovação</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-sm text-gray-900">{c.projeto}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{c.alunos}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{c.data}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${c.status === 'Emitido' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {c.status === "Emitido" ? (
                      <button className="text-sm font-bold text-gray-500 hover:text-gray-900">Ver</button>
                    ) : (
                      <button className="text-sm font-bold text-[#f19f17] hover:underline">Emitir</button>
                    )}
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
