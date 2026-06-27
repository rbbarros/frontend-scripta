export function agruparPortfoliosPorAluno(portfolios = []) {
  const grupos = new Map();

  portfolios.forEach((portfolio) => {
    const alunoId = Number(portfolio.aluno_id);

    if (!Number.isInteger(alunoId)) {
      return;
    }

    if (!grupos.has(alunoId)) {
      grupos.set(alunoId, {
        aluno_id: alunoId,
        nome_aluno: portfolio.nome_aluno || "Estudante não informado",
        cursos: [],
        semestres: [],
        projetos: [],
      });
    }

    const grupo = grupos.get(alunoId);

    if (portfolio.curso && !grupo.cursos.includes(portfolio.curso)) {
      grupo.cursos.push(portfolio.curso);
    }

    if (portfolio.semestre && !grupo.semestres.includes(portfolio.semestre)) {
      grupo.semestres.push(portfolio.semestre);
    }

    grupo.projetos.push({
      portfolio_id: portfolio.id,
      projeto_id: portfolio.projeto_id,
      titulo: portfolio.titulo_projeto,
      curso: portfolio.curso,
      semestre: portfolio.semestre,
    });
  });

  return Array.from(grupos.values())
    .map((grupo) => ({
      ...grupo,

      cursos: grupo.cursos.sort((a, b) => a.localeCompare(b, "pt-BR")),

      semestres: grupo.semestres.sort((a, b) => a.localeCompare(b, "pt-BR")),

      projetos: grupo.projetos.sort((a, b) =>
        String(a.titulo).localeCompare(String(b.titulo), "pt-BR"),
      ),
    }))
    .sort((a, b) => a.nome_aluno.localeCompare(b.nome_aluno, "pt-BR"));
}
