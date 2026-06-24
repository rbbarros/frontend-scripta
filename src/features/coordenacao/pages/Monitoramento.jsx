import React from "react";

export default function Monitoramento() {
  const areas = [
    { nome: "Desenvolvimento Web", qtd: 45, total: 100, cor: "bg-blue-500" },
    { nome: "Inteligência Artificial", qtd: 32, total: 100, cor: "bg-emerald-500" },
    { nome: "Banco de Dados", qtd: 28, total: 100, cor: "bg-[#f19f17]" },
    { nome: "Mobile", qtd: 20, total: 100, cor: "bg-purple-500" },
  ];

  const desempenho = [
    { curso: "Eng. Software", nota: "9.2" },
    { curso: "C. Computação", nota: "8.8" },
    { curso: "S. Informação", nota: "8.5" },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Monitoramento de Estágios e Práticas</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe indicadores de desempenho acadêmico e evolução de projetos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Projetos por Área */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
            Projetos por Área de Conhecimento
          </h2>
          
          <div className="space-y-6">
            {areas.map((a, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-700">{a.nome}</span>
                  <span className="font-bold text-gray-900">{a.qtd}</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${a.cor}`} style={{ width: `${(a.qtd / a.total) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desempenho Médio */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f19f17]"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Desempenho Médio
          </h2>

          <div className="space-y-4">
            {desempenho.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <span className="font-bold text-gray-700">{d.curso}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-600">{d.nota}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Média</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
