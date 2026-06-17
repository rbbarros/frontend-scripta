import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlunoPerfil, getProjetos } from "../../../lib/authService";

export default function Certificados() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [baixando, setBaixando] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("scripta_token")) { navigate("/"); return; }
    getAlunoPerfil().then(setPerfil).catch(() => navigate("/"));
    getProjetos().then(setProjetos).catch(() => setProjetos([]));
  }, [navigate]);

  const projetosDoAluno = useMemo(
    () => projetos.filter((p) =>
      perfil?.nome && p.aluno_responsavel?.toLowerCase().includes(perfil.nome.toLowerCase())
    ),
    [projetos, perfil]
  );

  const certificados = useMemo(
    () => projetosDoAluno.filter((p) => (p.status || "").toLowerCase() === "aprovado"),
    [projetosDoAluno]
  );

  const handleBaixar = (id) => {
    setBaixando(id);
    setTimeout(() => {
      setBaixando(null);
      alert("Funcionalidade de download de certificado em breve!");
    }, 1200);
  };

  const stats = [
    { label: "Projetos aprovados", value: certificados.length, icon: "🏆", color: "bg-amber-50 border-amber-100 text-amber-800" },
    { label: "Certificados disponíveis", value: certificados.length, icon: "📜", color: "bg-emerald-50 border-emerald-100 text-emerald-800" },
    { label: "Total de projetos", value: projetosDoAluno.length, icon: "📁", color: "bg-blue-50 border-blue-100 text-blue-800" },
  ];

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Certificados</h1>
        <p className="mt-2 text-sm text-gray-500">Seus projetos aprovados e conquistas acadêmicas</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-3xl border p-6 flex items-center gap-4 ${s.color}`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-70">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de Certificados */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Certificados Disponíveis</h2>

        {certificados.length > 0 ? (
          <div className="grid gap-5">
            {certificados.map((projeto) => (
              <article key={projeto.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                {/* Ícone + Info */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-sm shrink-0">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{projeto.titulo}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Professor: {projeto.professor_orientador || "Não informado"} • {projeto.area_conhecimento || "Área não informada"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        ✅ Aprovado
                      </span>
                      <span className="text-xs text-gray-400">Semestre {projeto.semestre || "não informado"}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleBaixar(projeto.id)}
                    disabled={baixando === projeto.id}
                    className="flex items-center gap-2 rounded-xl bg-[#f19f17] px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition-colors disabled:opacity-60"
                  >
                    {baixando === projeto.id ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    )}
                    Baixar PDF
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    Compartilhar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Nenhum certificado ainda</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Seus certificados aparecerão aqui assim que seus projetos forem avaliados e aprovados pelos professores.
            </p>
          </div>
        )}
      </div>

      {/* Projetos pendentes */}
      {projetosDoAluno.filter(p => (p.status || "").toLowerCase() !== "aprovado").length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Projetos em andamento</h2>
          <div className="space-y-3">
            {projetosDoAluno.filter(p => (p.status || "").toLowerCase() !== "aprovado").map((projeto) => (
              <div key={projeto.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{projeto.titulo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{projeto.area_conhecimento || "Área não informada"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  (projeto.status || "").toLowerCase() === "reprovado"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : (projeto.status || "").toLowerCase() === "em_revisao"
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {projeto.status || "Rascunho"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}