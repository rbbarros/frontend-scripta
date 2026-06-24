import React, { useState, useEffect } from "react";
import { updateProjetoStatus } from "../../../lib/projetosApi";;
import { getProfessorPerfil } from "../api/professorApi";

export default function RealizarAvaliacao({ projetoId, onClose }) {
  const [perfil, setPerfil] = useState(null);
  const [salvando, setSalvando] = useState(false);
  
  const [criterios, setCriterios] = useState({
    inovacao: 0,
    qualidade: 0,
    aplicabilidade: 0,
    clareza: 0,
  });
  const [parecer, setParecer] = useState("");

  useEffect(() => {
    getProfessorPerfil().then(setPerfil).catch(() => {});
  }, []);

  const getLabelAndColor = (val) => {
    if (val >= 95) return { label: "Excelente", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (val >= 85) return { label: "Ótimo", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (val >= 70) return { label: "Bom", color: "bg-amber-50 text-amber-700 border-amber-200" };
    if (val >= 50) return { label: "Ainda não suficiente", color: "bg-orange-50 text-orange-700 border-orange-200" };
    return { label: "Insuficiente", color: "bg-red-50 text-red-700 border-red-200" };
  };

  const handleSlider = (e, field) => {
    setCriterios({ ...criterios, [field]: parseInt(e.target.value, 10) });
  };

  const handleSubmit = async () => {
    setSalvando(true);
    try {
      await updateProjetoStatus(projetoId, "aprovado");
      alert("Avaliação salva com sucesso!");
      onClose();
    } catch (err) {
      alert("Erro ao salvar avaliação. " + err.message);
    } finally {
      setSalvando(false);
    }
  };

  const metrics = [
    { id: "inovacao", title: "Inovação", desc: "Grau de originalidade e criatividade da solução" },
    { id: "qualidade", title: "Qualidade técnica", desc: "Completude, robustez e boas práticas de desenvolvimento" },
    { id: "aplicabilidade", title: "Aplicabilidade", desc: "Potencial de uso real e impacto prático da solução" },
    { id: "clareza", title: "Clareza da solução", desc: "Qualidade da documentação e apresentação do projeto" },
  ];

  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Rubrica de Avaliação</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Info text */}
        <div className="px-6 py-4 bg-blue-50/50 border-b border-gray-100">
          <p className="text-xs text-blue-700 font-medium">
            <span className="font-bold">Métricas conceituais Senac:</span> Excelente (≥ 95%) - Ótimo (85-94%) - Bom (70-84%) - Ainda não suficiente (50-69%) - Insuficiente (&lt; 50%)
          </p>
        </div>

        {/* Sliders */}
        <div className="p-6 space-y-8 flex-1">
          {metrics.map((m) => {
            const val = criterios[m.id];
            const badge = getLabelAndColor(val);
            return (
              <div key={m.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{m.title}</h4>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{val}%</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={val} 
                    onChange={(e) => handleSlider(e, m.id)}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f19f17]"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-gray-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Parecer textual</h4>
            <textarea
              rows="4"
              placeholder="Descreva sua análise sobre o projeto, pontos fortes, pontos de melhoria e considerações finais..."
              className="w-full p-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#f19f17] focus:ring-2 focus:ring-amber-50 transition-all resize-none"
              value={parecer}
              onChange={(e) => setParecer(e.target.value)}
            ></textarea>
          </div>

          <div>
            <p className="text-xs text-gray-400">Avaliador registrado automaticamente: Prof. {perfil?.nome || "Ana Silva"} - {today}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button 
            onClick={handleSubmit} 
            disabled={salvando}
            className="px-6 py-2.5 bg-[#f19f17] text-white font-bold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar Avaliação"}
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
