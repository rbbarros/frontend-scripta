import React, { useEffect, useState } from "react";

import {
  Briefcase,
  Building2,
  Mail,
  Pencil,
  Save,
  Users,
  X,
} from "lucide-react";

import { getPortfoliosPublicos } from "../../../lib/portfolioApi";
import { getRanking } from "../../../lib/rankingApi";

import { getEmpresaPerfil, updateEmpresaPerfil } from "../api/empresaApi";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);

  const [formData, setFormData] = useState({
    nome_empresa: "",
    cnpj: "",
    email_contato: "",
    setor: "",
  });

  const [metricas, setMetricas] = useState({
    projetosPublicos: 0,
    talentos: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDados() {
      setCarregandoPerfil(true);
      setErro("");

      const [perfilResultado, rankingResultado, portfoliosResultado] =
        await Promise.allSettled([
          getEmpresaPerfil(),
          getRanking(),
          getPortfoliosPublicos(),
        ]);

      if (!componenteAtivo) {
        return;
      }

      if (perfilResultado.status === "fulfilled") {
        const dadosPerfil = perfilResultado.value;

        setPerfil(dadosPerfil);

        setFormData({
          nome_empresa: dadosPerfil?.nome_empresa || "",
          cnpj: dadosPerfil?.cnpj || "",
          email_contato: dadosPerfil?.email_contato || "",
          setor: dadosPerfil?.setor || "",
        });
      } else {
        setErro(
          perfilResultado.reason?.message ||
            "Não foi possível carregar o perfil da empresa.",
        );
      }

      const projetos =
        rankingResultado.status === "fulfilled" &&
        Array.isArray(rankingResultado.value?.ranking)
          ? rankingResultado.value.ranking
          : [];

      const portfolios =
        portfoliosResultado.status === "fulfilled" &&
        Array.isArray(portfoliosResultado.value)
          ? portfoliosResultado.value
          : [];

      const alunosDistintos = new Set(
        portfolios
          .map((portfolio) => portfolio.aluno_id)
          .filter((alunoId) => alunoId !== undefined && alunoId !== null),
      );

      setMetricas({
        projetosPublicos: projetos.length,
        talentos: alunosDistintos.size,
      });

      setCarregandoPerfil(false);
    }

    carregarDados();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormData((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function cancelarEdicao() {
    setFormData({
      nome_empresa: perfil?.nome_empresa || "",
      cnpj: perfil?.cnpj || "",
      email_contato: perfil?.email_contato || "",
      setor: perfil?.setor || "",
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
      await updateEmpresaPerfil(formData);

      setPerfil((perfilAtual) => ({
        ...perfilAtual,
        ...formData,
      }));

      setSucesso("Informações atualizadas com sucesso.");

      setIsEditing(false);
    } catch (error) {
      setErro(
        error.message || "Não foi possível atualizar o perfil da empresa.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const infoFields = [
    {
      label: "Nome da empresa",
      value: perfil?.nome_empresa || "Não informado",
      icon: <Building2 size={17} />,
    },
    {
      label: "CNPJ",
      value: perfil?.cnpj || "Não informado",
      icon: <Building2 size={17} />,
    },
    {
      label: "E-mail corporativo",
      value: perfil?.email_contato || "Não informado",
      icon: <Mail size={17} />,
    },
    {
      label: "Área de atuação",
      value: perfil?.setor || "Não informada",
      icon: <Briefcase size={17} />,
    },
  ];

  if (carregandoPerfil) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Perfil da empresa
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gerencie as informações da sua empresa na plataforma.
        </p>
      </header>

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          {sucesso}
        </div>
      )}

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <aside className="flex w-full flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm lg:w-1/3">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
            <Building2 size={34} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            {perfil?.nome_empresa || "Empresa"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {perfil?.setor || "Área de atuação não informada"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {perfil?.cnpj || "CNPJ não informado"}
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-2xl bg-gray-50 px-3 py-4">
              <Briefcase size={19} className="mb-2 text-[#f19f17]" />

              <span className="text-2xl font-bold text-gray-900">
                {metricas.projetosPublicos}
              </span>

              <span className="mt-1 text-xs text-gray-500">
                Projetos públicos
              </span>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-gray-50 px-3 py-4">
              <Users size={19} className="mb-2 text-emerald-600" />

              <span className="text-2xl font-bold text-gray-900">
                {metricas.talentos}
              </span>

              <span className="mt-1 text-xs text-gray-500">Talentos</span>
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
                  className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-5">
                <div>
                  <label
                    htmlFor="nome_empresa"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    Nome da empresa
                  </label>

                  <input
                    id="nome_empresa"
                    name="nome_empresa"
                    required
                    type="text"
                    value={formData.nome_empresa}
                    onChange={alterarCampo}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cnpj"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    CNPJ
                  </label>

                  <input
                    id="cnpj"
                    name="cnpj"
                    required
                    type="text"
                    value={formData.cnpj}
                    onChange={alterarCampo}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email_contato"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    E-mail corporativo
                  </label>

                  <input
                    id="email_contato"
                    name="email_contato"
                    required
                    type="email"
                    value={formData.email_contato}
                    onChange={alterarCampo}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="setor"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    Área de atuação
                  </label>

                  <input
                    id="setor"
                    name="setor"
                    required
                    type="text"
                    value={formData.setor}
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
                  Informações da empresa
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
