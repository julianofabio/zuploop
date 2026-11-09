Implemente a spec 001 Fundação completa, do T001 ao T040, seguindo
docs/specs/001-fundacao/spec.md, plan.md e tasks.md, o AGENTS.md
e o docs/design-system.md.

Regras:
- Trabalhe na branch "feature/001-fundacao".
- Siga a ordem do tasks.md. Em cada tarefa: escreva os testes de
  "Teste antes", implemente, rode a verificação, marque [x] e faça
  um commit "feat(001): Txxx descrição".
- Não pare para me perguntar entre as tarefas. Se algo estiver ambíguo,
  escolha a opção mais simples que respeite o FDD e os ADRs, anote em
  docs/specs/001-fundacao/notas.md e siga.
- Só pare se uma tarefa depender de algo que você não tem (acesso,
  conta, decisão de produto) ou se os testes não passarem depois de
  três tentativas. Nesse caso, anote em notas.md e pule para a próxima
  que não dependa dela.
- Não faça a T041 (publicação) nem a T042: são minhas.
- No fim, rode pnpm check e docker compose up --build, e me entregue um
  resumo: tarefas feitas, decisões anotadas, o que ficou pendente e
  como eu valido.
- Use as skills para implementação;
- Use as skills para codereview;
- Use as skills para testes;