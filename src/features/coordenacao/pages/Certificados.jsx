import React, { useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { useCoordenacaoCertificados } from "../hooks/useCoordenacaoCertificados";

function formatarData(data) {
  if (!data) {
    return "Não informada";
  }

  const dataSimples = data.slice(0, 10);
  const [ano, mes, dia] = dataSimples.split("-");

  if (!ano || !mes || !dia) {
    return data;
  }

  return `${dia}/${mes}/${ano}`;
}

export default function Certificados() {
  const { certificados, loading, error } = useCoordenacaoCertificados();

  const [searchTerm, setSearchTerm] = useState("");

  const [codigoCopiado, setCodigoCopiado] = useState(null);

  const termo = searchTerm.trim().toLowerCase();

  const certificadosFiltrados = certificados.filter((certificado) => {
    if (!termo) {
      return true;
    }

    return [
      certificado.nome_aluno,
      certificado.titulo_projeto,
      certificado.curso,
      certificado.nome_professor,
      certificado.codigo_autenticidade,
    ].some((valor) =>
      String(valor || "")
        .toLowerCase()
        .includes(termo),
    );
  });

  const copiarCodigo = async (certificado) => {
    try {
      await navigator.clipboard.writeText(certificado.codigo_autenticidade);

      setCodigoCopiado(certificado.id);

      setTimeout(() => {
        setCodigoCopiado(null);
      }, 1500);
    } catch {
      setCodigoCopiado(null);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 text-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Certificados
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Consulte os certificados emitidos para os projetos aprovados.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            placeholder="Buscar aluno, projeto ou código..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#f19f17]"
          />
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-3xl font-bold text-gray-900">
          {certificados.length}
        </p>

        <p className="mt-1 text-sm text-gray-500">Certificados emitidos</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Certificados emitidos
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Aluno
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Projeto
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Curso
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Semestre
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Professor
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Emissão
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Código
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Carregando certificados...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : certificadosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Nenhum certificado encontrado.
                  </td>
                </tr>
              ) : (
                certificadosFiltrados.map((certificado) => (
                  <tr key={certificado.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {certificado.nome_aluno}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {certificado.titulo_projeto}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {certificado.curso}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {certificado.semestre}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {certificado.nome_professor}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatarData(certificado.data_emissao)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => copiarCodigo(certificado)}
                        title="Copiar código de autenticidade"
                        className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#f19f17]"
                      >
                        {certificado.codigo_autenticidade}

                        {codigoCopiado === certificado.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
