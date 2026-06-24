import React, { useEffect, useState } from "react";
import { useProfessorPerfil } from "../hooks/useProfessorPerfil";

export default function Perfil() {
  const { perfil, updatePerfil } = useProfessorPerfil();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    area_atuacao: ""
  });
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    if (perfil && !isEditing) {
      setFormData({
        nome: perfil.nome || "",
        email: perfil.email || "",
        area_atuacao: perfil.area_atuacao || ""
      });
    }
  }, [perfil, isEditing]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      await updatePerfil(formData);
      setIsEditing(false);
    } catch (err) {
      alert("Erro ao atualizar o perfil.");
    } finally {
      setLoadingForm(false);
    }
  };

  const infoFields = [
    {
      label: "Nome completo",
      value: perfil?.nome || "Ana Silva",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    },
    {
      label: "E-mail institucional",
      value: perfil?.email || "ana.silva@senac.edu.br",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
    },
    {
      label: "Departamento",
      value: "Tecnologia da Informação",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
    },
    {
      label: "Especialidade",
      value: perfil?.area_atuacao || "Engenharia de Software, Inteligência Artificial",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie suas informações pessoais e profissionais</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Card */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white mb-6 shadow-sm">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Prof. {perfil?.nome?.split(" ")[0] || "Ana Silva"}</h2>
          <p className="text-sm text-gray-500 mt-1">Professor</p>

          <div className="flex gap-4 mt-8 w-full">
            <div className="flex-1 bg-gray-50 rounded-2xl py-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">34</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Avaliações</span>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl py-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">42</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Projetos</span>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden">
          {isEditing ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-800">Editar Informações</h2>
                <button onClick={() => setIsEditing(false)} className="text-sm font-semibold text-gray-400 hover:text-gray-600">
                  Cancelar
                </button>
              </div>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nome completo</label>
                  <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">E-mail institucional</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Área de Atuação / Especialidade</label>
                  <input type="text" value={formData.area_atuacao} onChange={e => setFormData({...formData, area_atuacao: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none focus:border-amber-500" />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" disabled={loadingForm} className="w-full bg-[#f19f17] text-white py-3 rounded-xl font-bold disabled:opacity-50">
                    {loadingForm ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-800">Informações Pessoais</h2>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-600 border border-amber-500 rounded-xl hover:bg-amber-50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Editar
                </button>
              </div>

              <div className="space-y-4">
                {infoFields.map((field, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="text-gray-400 mt-0.5">
                      {field.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{field.label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
