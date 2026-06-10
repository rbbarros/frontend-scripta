import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setErro("");

    // DIRECIONAMENTO EXCLUSIVO POR PERFIL PARA SUAS PRÓPRIAS ROTAS
    if (email === "aluno@gmail.com" && senha === "1234") {
      navigate("/aluno");
    } else if (email === "professor@gmail.com" && senha === "1234") {
      navigate("/professor");
    } else if (email === "coordenacao@gmail.com" && senha === "1234") {
      navigate("/admin"); // Redireciona para o ecossistema da Coordenação
    } else if (email === "empresa@gmail.com" && senha === "1234") {
      navigate("/company"); // Redireciona para o ecossistema da Empresa
    } else {
      setErro("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex font-sans antialiased">
      {/* LADO ESQUERDO: BANNER E APRESENTAÇÃO SCRIPTA (ALINHADO COM O FIGMA) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FCFAF7] p-16 flex-col justify-center items-center border-r border-gray-100">
        <div className="max-w-md w-full flex flex-col items-start">
          {/* Caixa Laranja com o Capelo */}
          <div className="w-56 h-28 bg-[#f19f17] rounded-3xl flex items-center justify-center text-white text-5xl shadow-md mb-8">
            🎓
          </div>

          {/* Nome alinhado à esquerda */}
          <h1 className="text-4xl font-bold text-[#1E293B] tracking-tight mb-4 text-left">
            Scripta
          </h1>

          {/* Texto de apoio com alinhamento justificado */}
          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            Sua plataforma acadêmica para gestão de projetos integradores.
            Publique, avalie e descubra projetos inovadores.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO DE ENTRADA */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full">
          {/* CABEÇALHO DO FORMULÁRIO */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Entrar na plataforma
            </h2>
            <p className="text-sm text-gray-400">
              Digite suas credenciais para acessar
            </p>
          </div>

          {/* MENSAGEM DE ERRO */}
          {erro && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-center">
              ⚠️ {erro}
            </div>
          )}

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* CAMPO EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg">
                  ✉️
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@senac.edu.br"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#f19f17] transition-colors"
                />
              </div>
            </div>

            {/* CAMPO SENHA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg">
                  🔒
                </span>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#f19f17] transition-colors"
                />
              </div>
            </div>

            {/* LEMBRAR DE MIM & ESQUECEU A SENHA */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  className="w-4 h-4 rounded text-[#f19f17] focus:ring-[#f19f17] border-gray-300 accent-[#f19f17]"
                />
                Lembrar de mim
              </label>
              <a
                href="#"
                className="text-[#f19f17] hover:underline font-medium"
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* BOTÃO ENTRAR */}
            <button
              type="submit"
              className="w-full bg-[#f19f17] hover:bg-[#d68a12] text-white font-semibold py-3.5 px-4 rounded-xl text-sm shadow-sm transition-colors mt-2"
            >
              Entrar
            </button>
          </form>

          {/* RODAPÉ DO CADASTRO */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Não tem uma conta?{" "}
              <a
                href="#"
                className="text-[#f19f17] hover:underline font-semibold transition-colors"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
