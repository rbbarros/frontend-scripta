import { Link } from "react-router-dom";
import { getAlunoPerfil } from "../../../lib/authService";
import { getProjetosDestaque } from "../../../lib/projetosService";
import { useAuthGuard } from "../../../shared/useAuthGuard";
import { useApiData } from "../../../shared/useApiData";

const atalhos = [
  { to: "/aluno/submeter", icon: "📤", color: "bg-blue-600", title: "Submeter", desc: "Envie seu novo projeto integrador" },
  { to: "/aluno/buscar", icon: "🔍", color: "bg-emerald-600", title: "Buscar Projetos", desc: "Explore projetos de outros alunos" },
  { to: "/aluno/ranking", icon: "🏆", color: "bg-[#c67c00]", title: "Ranking", desc: "Confira os melhores projetos" },
  { to: "/aluno/portfolio", icon: "💼", color: "bg-purple-600", title: "Portfólio", desc: "Gerencie seus projetos publicados" },
];

export default function Dashboard() {
  useAuthGuard();
  const { data: perfil } = useApiData(() => getAlunoPerfil(), []);
  const { data: destaque } = useApiData(() => getProjetosDestaque(), []);

  const projetos = Array.isArray(destaque) ? destaque : destaque?.itens || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {perfil?.nome ? `Olá, ${perfil.nome}` : "Bem-vindo ao Scripta"}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {perfil?.curso ? `Curso: ${perfil.curso}` : "Acesse rapidamente suas funcionalidades principais"}
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {atalhos.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="block rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white shadow-sm ${a.color}`}>
              {a.icon}
            </div>
            <h3 className="mb-1 text-sm font-bold text-gray-800">{a.title}</h3>
            <p className="text-xs text-gray-400">{a.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Projetos em Destaque</h2>
            <Link to="/aluno/buscar" className="text-xs font-semibold text-[#f19f17] hover:underline">
              Ver todos →
            </Link>
          </div>

          {projetos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-400 shadow-sm">
              Nenhum projeto em destaque disponível no momento.
            </div>
          ) : (
            projetos.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{p.titulo}</h4>
                  <span className="text-xs text-gray-400">
                    {p.area_conhecimento || p.curso}
                  </span>
                </div>
                {p.media_geral != null && (
                  <div className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-[#c67c00]">
                    🏆 {Number(p.media_geral).toFixed(1)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-gray-800">Ações Rápidas</h3>
            <div className="space-y-2 text-xs">
              <Link to="/aluno/projetos" className="block rounded-xl bg-gray-50 p-3 font-medium text-gray-600 hover:bg-gray-100">
                📂 Acompanhar meus projetos
              </Link>
              <Link to="/aluno/certificados" className="block rounded-xl bg-gray-50 p-3 font-medium text-gray-600 hover:bg-gray-100">
                📜 Ver meus certificados
              </Link>
              <Link to="/aluno/perfil" className="block rounded-xl bg-gray-50 p-3 font-medium text-gray-600 hover:bg-gray-100">
                👤 Editar meu perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
