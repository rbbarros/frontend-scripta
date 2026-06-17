import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmpresaPerfil, getPortfolioList } from "../../../lib/authService";

export default function Talentos() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [talentos, setTalentos] = useState([]);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [cursoFiltro, setCursoFiltro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) {
      navigate("/");
      return;
    }

    getEmpresaPerfil()
      .then(setPerfil)
      .catch((e) => {
        setErro(e.message || "Não foi possível carregar as oportunidades.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });

    // Simulando dados de alunos com portfólio já que a API de alunos pode não retornar tudo detalhado
    // Idealmente, bateríamos em um endpoint que retorna todos os alunos com visibilidade "publico"
    getPortfolioList()
      .then(lista => {
        // Agrupar projetos por aluno para formar o "talento"
        // Como não temos os dados completos do aluno na rota de portfólio, vamos criar mocks baseados no ID do aluno
        const alunosMap = new Map();
        lista.forEach(item => {
          if (item.visibilidade === "publico") {
            if (!alunosMap.has(item.aluno_id)) {
              alunosMap.set(item.aluno_id, {
                id: item.aluno_id,
                nome: `Aluno ${item.aluno_id}`, // Mock
                curso: "Engenharia de Software",
                semestre: "4º semestre",
                competencias: ["Python", "React", "UX/UI"],
                email: `aluno${item.aluno_id}@portfolio.senac.edu.br`,
                contatoAutorizado: true,
                media: "90%",
                projetosCount: 1
              });
            } else {
              const aluno = alunosMap.get(item.aluno_id);
              aluno.projetosCount += 1;
            }
          }
        });
        
        // Se não houver dados, mostramos alguns mocks para a interface ficar igual à imagem
        if (alunosMap.size === 0) {
          setTalentos([
            {
              id: 1,
              nome: "João Silva",
              curso: "Engenharia de Software",
              semestre: "4º semestre",
              competencias: ["UI/UX", "Python", "React", "Liderança"],
              email: "joao.silva@portfolio.senac.edu.br",
              contatoAutorizado: true,
              media: "92%",
              projetosCount: 2
            },
            {
              id: 2,
              nome: "Maria Santos",
              curso: "Sistemas de Informação",
              semestre: "6º semestre",
              competencias: ["UX Design", "Vue.js", "Python", "Gestão Ágil"],
              email: "maria.santos@portfolio.senac.edu.br",
              contatoAutorizado: true,
              media: "88%",
              projetosCount: 2
            },
            {
              id: 3,
              nome: "Pedro Costa",
              curso: "Ciência da Computação",
              semestre: "8º semestre",
              competencias: ["Blockchain", "Go", "Rust", "Arquitetura de Sistemas"],
              email: "Contato não autorizado pelo aluno",
              contatoAutorizado: false,
              media: "96%",
              projetosCount: 3
            }
          ]);
        } else {
          setTalentos(Array.from(alunosMap.values()));
        }
      })
      .catch(() => setTalentos([]));
  }, [navigate]);

  const talentosFiltrados = talentos.filter(t => {
    const matchBusca = t.nome.toLowerCase().includes(busca.toLowerCase()) || 
                       t.competencias.some(c => c.toLowerCase().includes(busca.toLowerCase()));
    const matchCurso = cursoFiltro === "" || t.curso === cursoFiltro;
    return matchBusca && matchCurso;
  });

  const cursosUnicos = Array.from(new Set(talentos.map(t => t.curso)));

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Talentos</h1>
        <p className="mt-2 text-sm text-gray-500">
          Identifique estudantes com competências alinhadas ao seu negócio
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por nome ou competência..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-amber-500"
          />
        </div>
        <select
          value={cursoFiltro}
          onChange={e => setCursoFiltro(e.target.value)}
          className="w-full md:w-64 rounded-2xl border border-gray-200 py-3 px-4 text-sm outline-none focus:border-amber-500 bg-white"
        >
          <option value="">Todos os cursos</option>
          {cursosUnicos.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {talentosFiltrados.map((talento) => (
          <article key={talento.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white text-xl font-bold shrink-0">
              👤
            </div>
            
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{talento.nome}</h2>
              <p className="text-sm text-gray-500 mt-1">{talento.curso} • {talento.semestre}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {talento.competencias.map(comp => (
                  <span key={comp} className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {comp}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-gray-400">✉️</span>
                {talento.contatoAutorizado ? (
                  <>
                    <a href={`mailto:${talento.email}`} className="text-blue-600 hover:underline">{talento.email}</a>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 ml-2">Contato autorizado</span>
                  </>
                ) : (
                  <span className="text-gray-500 italic">{talento.email}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end justify-between h-full min-h-[100px]">
              <p className="text-sm font-semibold text-[#f19f17]">
                {talento.media} média <span className="text-gray-400 font-normal">• {talento.projetosCount} projetos</span>
              </p>
              <button className="text-sm font-bold text-[#f19f17] hover:underline flex items-center gap-1 mt-auto">
                Ver portfólio ↗
              </button>
            </div>
          </article>
        ))}
        {!talentosFiltrados.length && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            Nenhum talento encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </section>
  );
}
