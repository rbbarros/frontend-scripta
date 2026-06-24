import React, { useMemo, useState } from "react";
import { useAlunoDashboard } from "../hooks/useAlunoDashboard";

export default function Buscar() {
  const { projetos } = useAlunoDashboard();
  const [termo, setTermo] = useState("");
  
  // Filtros
  const [curso, setCurso] = useState("");
  const [semestre, setSemestre] = useState("");
  const [ano, setAno] = useState("");
  const [area, setArea] = useState("");

  const limparFiltros = () => {
    setCurso("");
    setSemestre("");
    setAno("");
    setArea("");
    setTermo("");
  };

  const resultados = useMemo(() => {
    const query = termo.trim().toLowerCase();

    return projetos.filter((projeto) => {
      // Mock properties just to simulate the UI for existing backend projects
      const projAno = projeto.ano || "2026";
      const projSemestre = projeto.semestre || "6º";
      const projCurso = projeto.curso || "Engenharia de Software";
      const projArea = projeto.area_conhecimento || "Tecnologia";
      const projNota = projeto.nota || (Math.random() * (10 - 8) + 8).toFixed(1);

      if (query && ![projeto.titulo, projeto.descricao, projCurso].some(val => (val || "").toLowerCase().includes(query))) {
        return false;
      }
      if (curso && projCurso !== curso) return false;
      if (semestre && projSemestre !== semestre) return false;
      if (ano && projAno !== ano) return false;
      if (area && projArea !== area) return false;

      // Atrelando esses dados mockados ao projeto para renderizar
      projeto._UI = { ano: projAno, semestre: projSemestre, curso: projCurso, area: projArea, nota: projNota };
      return true;
    });
  }, [projetos, termo, curso, semestre, ano, area]);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Buscar Projetos</h1>
        <p className="mt-2 text-sm text-gray-500">Explore projetos acadêmicos de diferentes cursos e semestres</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filtros */}
        <div className="w-full md:w-64 shrink-0 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#f19f17]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </span>
            <h2 className="font-bold text-gray-800">Filtros</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Curso</label>
              <select value={curso} onChange={(e) => setCurso(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="">Todos os cursos</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Ciência da Computação">Ciência da Computação</option>
                <option value="Sistemas de Informação">Sistemas de Informação</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Semestre</label>
              <select value={semestre} onChange={(e) => setSemestre(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="">Todos os semestres</option>
                <option value="1º">1º Semestre</option>
                <option value="2º">2º Semestre</option>
                <option value="3º">3º Semestre</option>
                <option value="4º">4º Semestre</option>
                <option value="5º">5º Semestre</option>
                <option value="6º">6º Semestre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ano</label>
              <select value={ano} onChange={(e) => setAno(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="">Todos os anos</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Área de conhecimento</label>
              <select value={area} onChange={(e) => setArea(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#f19f17] bg-white">
                <option value="">Todas as áreas</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Saúde">Saúde</option>
                <option value="Negócios">Negócios</option>
              </select>
            </div>
          </div>

          <button onClick={limparFiltros} className="mt-8 w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800">
            Limpar Filtros
          </button>
        </div>

        {/* Resultados */}
        <div className="flex-1 w-full space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input 
              value={termo} 
              onChange={(e) => setTermo(e.target.value)} 
              placeholder="Buscar por título, descrição ou palavras-chave..." 
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-11 shadow-sm outline-none focus:border-[#f19f17]" 
            />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-4">{resultados.length} projetos encontrados</p>
            
            <div className="space-y-4">
              {resultados.map((projeto) => (
                <article key={projeto.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-lg font-bold text-gray-800">{projeto.titulo}</h2>
                    <span className="flex items-center gap-1 bg-amber-50 text-[#c67c00] px-3 py-1 rounded-full text-xs font-bold border border-amber-100 shrink-0">
                      ⭐ {projeto._UI?.nota}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {projeto.descricao || "Este projeto não possui uma descrição fornecida. Para saber mais detalhes, acesse a página do projeto ou entre em contato com os autores."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                      {projeto._UI?.curso}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {projeto._UI?.semestre} • {projeto._UI?.ano}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      {Math.floor(Math.random() * 3) + 2} integrantes
                    </span>
                  </div>
                </article>
              ))}
              {!resultados.length && (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
                  Nenhum projeto encontrado com os filtros atuais.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}