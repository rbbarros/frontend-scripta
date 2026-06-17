import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfessorPerfil, getProjetos } from "../../../lib/authService";
import { atualizarStatusProjeto } from "../../../lib/projetoService";

export default function Avaliacoes() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [erro, setErro] = useState("");
  const [avaliandoId, setAvaliandoId] = useState(null);
  const [parecer, setParecer] = useState("suficiente");

  useEffect(() => {
    const token = localStorage.getItem("scripta_token");
    if (!token) {
      navigate("/");
      return;
    }

    getProfessorPerfil()
      .then(setPerfil)
      .catch((e) => {
        setErro(e.message || "Não foi possível carregar suas avaliações.");
        localStorage.removeItem("scripta_token");
        localStorage.removeItem("scripta_user_type");
        navigate("/");
      });

    carregarProjetos();
  }, [navigate]);

  const carregarProjetos = () => {
    getProjetos().then(setProjetos).catch(() => setProjetos([]));
  };

  const pendentes = projetos.filter((projeto) => ["submetido", "em_revisao", "em_avaliacao"].includes((projeto.status || "").toLowerCase()));

  const handleAvaliar = async (idProjeto) => {
    try {
      const novoStatus = parecer === "suficiente" ? "aprovado" : "reprovado";
      await atualizarStatusProjeto(idProjeto, novoStatus);
      setAvaliandoId(null);
      carregarProjetos();
    } catch (e) {
      alert("Erro ao enviar avaliação: " + e.message);
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Avaliações pendentes</h2>
        <p className="mt-2 text-sm text-gray-400">
          {erro || (perfil ? `Professor ${perfil.nome}, estes são os projetos que ainda precisam de avaliação.` : "Carregando dados...")}
        </p>
      </div>

      <div className="grid gap-4">
        {pendentes.map((projeto) => (
          <article key={projeto.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{projeto.titulo}</h3>
              <p className="mt-1 text-sm text-gray-500">Responsável: {projeto.aluno_responsavel} • Status atual: {projeto.status}</p>
            </div>
            
            {avaliandoId === projeto.id ? (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full md:w-auto mt-4 md:mt-0">
                <p className="text-sm font-semibold mb-2 text-gray-700">Dar parecer:</p>
                <select 
                  value={parecer} 
                  onChange={(e) => setParecer(e.target.value)}
                  className="w-full mb-3 rounded-lg border border-gray-300 p-2 text-sm"
                >
                  <option value="suficiente">Suficiente (Aprovar)</option>
                  <option value="insuficiente">Insuficiente (Reprovar)</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={() => handleAvaliar(projeto.id)} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Confirmar</button>
                  <button onClick={() => setAvaliandoId(null)} className="flex-1 rounded-lg bg-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-300">Cancelar</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setAvaliandoId(projeto.id); setParecer("suficiente"); }}
                className="rounded-xl bg-[#f19f17] px-4 py-2 text-sm font-bold text-white hover:bg-amber-600"
              >
                Avaliar
              </button>
            )}
          </article>
        ))}
        {!pendentes.length && <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm text-center">Nenhuma avaliação pendente no momento.</div>}
      </div>
    </section>
  );
}
