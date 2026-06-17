import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAlunoPerfil, getProjetos } from "../../../lib/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) {
      navigate("/");
      return;
    }

    getAlunoPerfil()
      .then((data) => setPerfil(data))
      .catch((e) => {
        setErro(e.message || "Não foi possível carregar seu perfil.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      })
      .finally(() => setCarregando(false));

    getProjetos()
      .then(setProjetos)
      .catch(() => setProjetos([]));
  }, [navigate]);

  // Simulando top projetos e notas
  const projetosEmDestaque = [
    { id: 1, titulo: "Sistema de IA para Diagnóstico Médico", curso: "Engenharia de Software", tempo: "2 dias atrás", nota: "9.8" },
    { id: 2, titulo: "Plataforma de Blockchain para Certificados", curso: "Ciência da Computação", tempo: "5 dias atrás", nota: "9.6" },
    { id: 3, titulo: "App de Realidade Aumentada Educacional", curso: "Sistemas de Informação", tempo: "1 semana atrás", nota: "9.5" }
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {carregando ? "Carregando..." : perfil?.nome ? `Olá, ${perfil.nome}` : "Bem-vindo ao Scripta"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {erro || "Acesse rapidamente suas funcionalidades principais"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/aluno/submeter" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow block text-left">
          <div className="w-full h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Submeter Projeto</h3>
          <p className="text-xs text-gray-400">Envie seu novo projeto integrador</p>
        </Link>

        <Link to="/aluno/buscar" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow block text-left">
          <div className="w-full h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Buscar Projetos</h3>
          <p className="text-xs text-gray-400">Explore projetos de outros alunos</p>
        </Link>

        <Link to="/aluno/ranking" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow block text-left">
          <div className="w-full h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Ver Ranking</h3>
          <p className="text-xs text-gray-400">Confira os melhores projetos</p>
        </Link>

        <Link to="/aluno/portfolio" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow block text-left">
          <div className="w-full h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Meu Portfólio</h3>
          <p className="text-xs text-gray-400">Gerencie seus projetos publicados</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-800">Projetos em Destaque</h2>
            <Link to="/aluno/buscar" className="text-sm font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1">Ver todos <span>→</span></Link>
          </div>
          <div className="space-y-3">
            {projetosEmDestaque.map((projeto) => (
              <div key={projeto.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{projeto.titulo}</h4>
                  <span className="text-xs text-gray-500">{projeto.curso} • {projeto.tempo}</span>
                </div>
                <div className="bg-amber-50 text-[#c67c00] px-3 py-1 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                  <span>🏆</span> {projeto.nota}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Notificações</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-800">Novo projeto avaliado</span>
                <span className="text-xs text-gray-400">Há 2 horas</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-800">Empresa visualizou seu portfólio</span>
                <span className="text-xs text-gray-400">Há 5 horas</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-800">Certificado disponível</span>
                <span className="text-xs text-gray-400">Ontem</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link to="/aluno/submeter" className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium">
                Enviar nova submissão
              </Link>
              <Link to="/aluno/meus-projetos" className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium">
                Ver status das avaliações
              </Link>
              <Link to="/aluno/certificados" className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium">
                Baixar certificados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
