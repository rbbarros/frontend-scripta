import React, { useEffect, useState } from "react";

import {
  Briefcase,
  CheckCircle2,
  Mail,
  Pencil,
  Save,
  User,
  X,
} from "lucide-react";

import { useProfessorPerfil } from "../hooks/useProfessorPerfil";

export default function Perfil() {
  const {
    perfil,
    metricas,
    loading,
    erro: erroCarregamento,
    updatePerfil,
  } = useProfessorPerfil();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    area_atuacao: "",
  });

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    if (perfil && !isEditing) {
      setFormData({
        nome: perfil.nome || "",
        email: perfil.email || "",
        area_atuacao: perfil.area_atuacao || "",
      });
    }
  }, [perfil, isEditing]);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function cancelarEdicao() {
    setFormData({
      nome: perfil?.nome || "",
      email: perfil?.email || "",
      area_atuacao: perfil?.area_atuacao || "",
    });

    setErro("");
    setSucesso("");
    setIsEditing(false);
  }

  async function handleEdit(event) {
    event.preventDefault();

    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await updatePerfil(formData);

      setIsEditing(false);

      setSucesso("Informações atualizadas com sucesso.");
    } catch (error) {
      setErro(error.message || "Não foi possível atualizar o perfil.");
    } finally {
      setSalvando(false);
    }
  }

  const infoFields = [
    {
      label: "Nome completo",
      value: perfil?.nome || "Não informado",
      icon: <User size={17} />,
    },
    {
      label: "E-mail institucional",
      value: perfil?.email || "Não informado",
      icon: <Mail size={17} />,
    },
    {
      label: "Área de atuação",
      value: perfil?.area_atuacao || "Não informada",
      icon: <Briefcase size={17} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  const primeiroNome = perfil?.nome?.trim().split(/\s+/)[0] || "Professor";

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Meu perfil
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas informações pessoais e profissionais.
        </p>
      </header>

      {(erroCarregamento || erro) && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro || erroCarregamento}
        </div>
      )}

      {sucesso && (
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          {sucesso}
        </div>
      )}

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <aside className="flex w-full flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm lg:w-1/3">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm">
            <User size={40} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Prof. {primeiroNome}
          </h2>

          <p className="mt-1 text-sm text-gray-500">Professor</p>

          <p className="mt-2 text-xs text-gray-400">
            {perfil?.area_atuacao || "Área de atuação não informada"}
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-2xl bg-gray-50 px-3 py-4">
              <CheckCircle2 size={19} className="mb-2 text-emerald-600" />

              <span className="text-2xl font-bold text-gray-900">
                {metricas.avaliacoes}
              </span>

              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Avaliações
              </span>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-gray-50 px-3 py-4">
              <Briefcase size={19} className="mb-2 text-[#f19f17]" />

              <span className="text-2xl font-bold text-gray-900">
                {metricas.projetos}
              </span>

              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Projetos
              </span>
            </div>
          </div>
        </aside>

        <main className="relative w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:w-2/3">
          {isEditing ? (
            <div>
              <div className="mb-8 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Editar informações
                </h2>

                <button
                  type="button"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-5">
                <div>
                  <label
                    htmlFor="nome"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    Nome completo
                  </label>

                  <input
                    id="nome"
                    name="nome"
                    required
                    type="text"
                    value={formData.nome}
                    onChange={alterarCampo}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    E-mail institucional
                  </label>

                  <input
                    id="email"
                    name="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={alterarCampo}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="area_atuacao"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    Área de atuação
                  </label>

                  <input
                    id="area_atuacao"
                    name="area_atuacao"
                    type="text"
                    value={formData.area_atuacao}
                    onChange={alterarCampo}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f19f17] py-3 font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={17} />

                    {salvando ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="mb-8 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Informações pessoais
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setErro("");
                    setSucesso("");
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50"
                >
                  <Pencil size={15} />
                  Editar
                </button>
              </div>

              <div className="space-y-4">
                {infoFields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4"
                  >
                    <div className="mt-0.5 text-gray-400">{field.icon}</div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {field.label}
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                        {field.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
