import React, { useState } from "react";
import { Award, Check, Copy } from "lucide-react";

import { useAlunoCertificados } from "../hooks/useAlunoCertificados";

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
  const { certificados, loading, erro } = useAlunoCertificados();

  const [codigoCopiado, setCodigoCopiado] = useState(null);

  async function copiarCodigo(certificado) {
    try {
      await navigator.clipboard.writeText(certificado.codigo_autenticidade);

      setCodigoCopiado(certificado.id);

      setTimeout(() => {
        setCodigoCopiado(null);
      }, 1500);
    } catch {
      setCodigoCopiado(null);
    }
  }

  const ultimoCertificado = certificados.length > 0 ? certificados[0] : null;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Meus certificados
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Certificados emitidos para sua participação em projetos integradores
          aprovados.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-[#f19f17]">
            <Award className="h-6 w-6" />
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">
              {certificados.length}
            </p>

            <p className="text-sm text-gray-500">Certificados emitidos</p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Award className="h-6 w-6" />
          </div>

          <div>
            <p className="text-lg font-bold text-gray-900">
              {ultimoCertificado
                ? formatarData(ultimoCertificado.data_emissao)
                : "Nenhum"}
            </p>

            <p className="text-sm text-gray-500">Último certificado</p>
          </div>
        </article>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Certificados disponíveis
        </h2>

        {loading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">Carregando certificados...</p>
          </div>
        ) : erro ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-600">{erro}</p>
          </div>
        ) : certificados.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <Award className="mx-auto h-10 w-10 text-gray-300" />

            <h3 className="mt-4 font-bold text-gray-800">
              Nenhum certificado emitido
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Seus certificados aparecerão aqui depois que a coordenação fizer a
              emissão.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {certificados.map((certificado) => (
              <article
                key={certificado.id}
                className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f19f17] text-white">
                      <Award className="h-6 w-6" />
                    </div>

                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Emitido
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {certificado.titulo_projeto}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <p>
                      <strong className="text-gray-700">Aluno:</strong>{" "}
                      {certificado.nome_aluno}
                    </p>

                    <p>
                      <strong className="text-gray-700">Curso:</strong>{" "}
                      {certificado.curso}
                    </p>

                    <p>
                      <strong className="text-gray-700">Semestre:</strong>{" "}
                      {certificado.semestre}
                    </p>

                    <p>
                      <strong className="text-gray-700">Professor:</strong>{" "}
                      {certificado.nome_professor}
                    </p>

                    <p>
                      <strong className="text-gray-700">
                        Data de emissão:
                      </strong>{" "}
                      {formatarData(certificado.data_emissao)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Código de autenticidade
                  </p>

                  <button
                    type="button"
                    onClick={() => copiarCodigo(certificado)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 font-mono text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#f19f17]"
                    title="Copiar código de autenticidade"
                  >
                    <span className="break-all text-left">
                      {certificado.codigo_autenticidade}
                    </span>

                    {codigoCopiado === certificado.id ? (
                      <Check className="h-4 w-4 shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
