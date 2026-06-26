import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAluno } from "../../../lib/authService";

export default function RegisterAluno() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado.endsWith("@edu.pe.senac.br")) {
      setErro("Utilize o e-mail institucional do Senac (@edu.pe.senac.br).");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await registerAluno({
        nome,
        email: emailNormalizado,
        curso,
        senha,
        confirmar_senha: confirmarSenha,
      });
      setSucesso(
        "Conta de aluno criada com sucesso. Faça login para continuar.",
      );
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setErro(err.message || "Não foi possível cadastrar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex font-sans antialiased">
      <div className="hidden lg:flex lg:w-1/2 bg-[#FCFAF7] p-16 flex-col justify-center items-center border-r border-gray-100">
        <div className="max-w-md w-full flex flex-col items-start">
          <div className="w-56 h-28 bg-[#f19f17] rounded-3xl flex items-center justify-center text-white text-5xl shadow-md mb-8">
            🎓
          </div>
          <h1 className="text-4xl font-bold text-[#1E293B] tracking-tight mb-4 text-left">
            Bem-vindo ao Scripta
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            Acesse a plataforma para submeter e gerenciar seus projetos
            integradores.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
        <div className="max-w-md w-full py-8">
          <button
            onClick={() => navigate("/cadastro")}
            className="text-sm text-[#f19f17] hover:underline mb-6 flex items-center gap-1 font-medium"
          >
            &larr; Trocar perfil
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Criar conta como Aluno
            </h2>
            <p className="text-sm text-gray-400">
              Preencha os dados para começar
            </p>
          </div>

          {erro && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-center">
              ⚠️ {erro}
            </div>
          )}

          {sucesso && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold text-center">
              ✅ {sucesso}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@edu.pe.senac.br"
                autoComplete="email"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curso
              </label>
              <input
                type="text"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                placeholder="Ex: Engenharia de Software"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Crie uma senha segura"
                autoComplete="new-password"
                minLength={6}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
                minLength={6}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f19f17]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f19f17] text-white py-3 rounded-xl font-semibold mt-4 hover:bg-[#d98b14] transition-colors disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-[#f19f17] hover:underline font-semibold"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
