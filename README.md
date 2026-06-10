# 🎓 Scripta — Frontend

O **Scripta** é uma plataforma acadêmica voltada para a gestão, publicação, avaliação e descoberta de projetos integradores inovadores no ambiente educacional. Este repositório contém todo o ecossistema Frontend e de Interface com o Usuário (UI).

---

## 🏗️ Arquitetura do Projeto

O projeto adota uma **Arquitetura Baseada em Features (Módulos Coesos)**, que isola as regras e domínios de negócio específicos de cada ator do sistema. Isso garante alta manutenibilidade, separação clara de responsabilidades e escalabilidade do código.

Abaixo está o mapeamento atual da estrutura de diretórios do projeto dentro do diretório `/src`:

```text
src/
├── app/               # Configurações globais, ponto de entrada e roteamento principal
│   ├── App.jsx        # Componente que envelopa o provedor de rotas
│   ├── main.jsx       # Inicialização e renderização do React no DOM (Vite)
│   └── routes.jsx     # Central de gerenciamento das rotas principais (/login, /aluno/*)
│
├── assets/            # Mídias estáticas globais (imagens, logotipos, ícones)
│
├── components/        # Componentes visuais globais reutilizáveis de baixo nível (ex: Button.jsx)
│
├── features/          # Módulos de regras de negócio isolados por contexto
│   ├── auth/          # Fluxo de autenticação, validação e login
│   │   ├── components/
│   │   └── pages/     # Login.jsx
│   │
│   ├── student/       # Ecossistema e área logada do Aluno
│   │   ├── components/# AlunoLayout.jsx (Navbar e Footer unificados)
│   │   ├── pages/     # Dashboard.jsx (Início) e Portfolio.jsx
│   │   └── routes.jsx # Sub-roteador interno exclusivo do perfil estudante
│   │
│   ├── professor/     # Funcionalidades e painel do avaliador/docente
│   ├── admin/         # Painel administrativo e coordenação
│   └── company/       # Portal corporativo de conexões com empresas
│
├── shared/            # Lógicas utilitárias e hooks genéricos compartilhados pelo app
│
└── styles/            # Estilizações globais do projeto (Tailwind CSS)