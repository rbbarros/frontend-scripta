import React, { useEffect, useState } from "react";
import { getEmpresaPerfil, updateEmpresaPerfil } from "../api/empresaApi";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_empresa: "",
    cnpj: "",
    email_contato: "",
    setor: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmpresaPerfil()
      .then((data) => {
        setPerfil(data);
        if (data) {
          setFormData({
            nome_empresa: data.nome_empresa || "",
            cnpj: data.cnpj || "",
            email_contato: data.email_contato || "",
            setor: data.setor || ""
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEmpresaPerfil(formData);
      setPerfil((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (err) {
      alert("Erro ao atualizar o perfil da empresa.");
    } finally {
      setLoading(false);
    }
  };

  const infoFields = [
    {
      label: "Razão Social",
      value: perfil?.nome_empresa || "TechCorp Brasil Ltda.",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
    },
    {
      label: "Nome Fantasia",
      value: perfil?.nome_empresa || "TechCorp Brasil",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
    },
    {
      label: "CNPJ",
      value: perfil?.cnpj || "12.345.678/0001-90",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
    },
    {
      label: "E-mail Corporativo",
      value: perfil?.email_contato || "contato@techcorp.com.br",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
    },
    {
      label: "Site",
      value: "https://www.techcorp.com.br",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
    },
    {
      label: "Área de Atuação",
      value: perfil?.setor || "Tecnologia da Informação",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
    },
    {
      label: "Telefone",
      value: perfil?.telefone || "(11) 3456-7890",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Perfil da Empresa</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie as informações da sua empresa na plataforma</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Card */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><rect x="9" y="14" width="6" height="8"></rect><line x1="9" y1="6" x2="15" y2="6"></line><line x1="9" y1="10" x2="15" y2="10"></line></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{perfil?.nome_empresa || "TechCorp Brasil"}</h2>
          <p className="text-sm text-gray-500 mt-1">{perfil?.setor || "Tecnologia da Informação"}</p>
          <p className="text-xs text-gray-400 mt-1">{perfil?.cnpj || "12.345.678/0001-90"}</p>

          <div className="flex gap-4 mt-8 w-full">
            <div className="flex-1 bg-gray-50 rounded-2xl py-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">187</span>
              <span className="text-xs text-gray-500 mt-1">Proj. vistos</span>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl py-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">24</span>
              <span className="text-xs text-gray-500 mt-1">Talentos</span>
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
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Razão Social / Nome Fantasia</label>
                  <input required type="text" value={formData.nome_empresa} onChange={e => setFormData({...formData, nome_empresa: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">CNPJ</label>
                  <input required type="text" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">E-mail Corporativo</label>
                  <input required type="email" value={formData.email_contato} onChange={e => setFormData({...formData, email_contato: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Área de Atuação</label>
                  <input required type="text" value={formData.setor} onChange={e => setFormData({...formData, setor: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none focus:border-amber-500" />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" disabled={loading} className="w-full bg-[#f19f17] text-white py-3 rounded-xl font-bold disabled:opacity-50">
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-800">Informações da Empresa</h2>
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
    </>
  );
}
