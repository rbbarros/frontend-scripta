import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginAluno,
  loginProfessor,
  loginEmpresa,
} from "../../../lib/authService";

const loginRoutes = {
  aluno: "/aluno",
  professor: "/professor",
  empresa: "/empresa",
};

export default function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("aluno");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const payload =
        userType === "empresa"
          ? { email_contato: email, senha }
          : { email, senha };

      let response;
      if (userType === "aluno") {
        response = await loginAluno(payload);
      } else if (userType === "professor") {
        response = await loginProfessor(payload);
      } else {
        response = await loginEmpresa(payload);
      }

      localStorage.setItem("scripta_token", response.access_token);
      localStorage.setItem("scripta_user_type", userType);
      navigate(loginRoutes[userType]);
    } catch (err) {
      setErro(err.message || "Erro ao efetuar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const emailLabel = userType === "empresa" ? "E-mail de contato" : "E-mail institucional";
  const emailPlaceholder =
    userType === "empresa" ? "contato@empresa.com.br" : "seu.email@senac.edu.br";

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex font-sans antialiased">
      <div className="hidden lg:flex lg:w-1/2 bg-[#FCFAF7] p-16 flex-col justify-center items-center border-r border-gray-100">
        <div className="max-w-md w-full flex flex-col items-start">
          <div className="w-56 h-28 bg-[#f19f17] rounded-3xl flex items-center justify-center text-white text-5xl shadow-md mb-8">
            🎓
          </div>
          <h1 className="text-4xl font-bold text-[#1E293B] tracking-tight mb-4 text-left">
            Scripta
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            Sua plataforma acadêmica para gestão de projetos integradores.
            Publique, avalie e descubra projetos inovadores.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Entrar na plataforma
            </h2>
            <p className="text-sm text-gray-400">Selecione seu perfil e faça login.</p>
          </div>

          {erro && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-center">
              ⚠️ {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full p-3 border rounded-xl"
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-xl"
                placeholder={emailPlaceholder}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full p-3 border rounded-xl"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f19f17] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Não tem uma conta? {" "}
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="text-[#f19f17] hover:underline font-semibold transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
