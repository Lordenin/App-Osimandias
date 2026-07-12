# Progresso — Money Tracker

## Fase 1 — Setup do projeto
- [x] `create-next-app` (App Router + TypeScript) + Tailwind CSS
- [x] Estrutura de pastas (`app/`, `components/`, `lib/`, `supabase/migrations/`)
- [x] `CLAUDE.md`
- [x] `PROGRESS.md`
- [x] `.env.example`
- [x] Build e lint limpos
- [x] Commit: "Setup inicial do projeto"

## Fase 2 — Supabase (banco de dados)
- [ ] Migrations SQL: `households`, `household_members`, `categorias`, `lancamentos`, enums
- [ ] RLS em todas as tabelas (select/insert/update/delete explícitas)
- [ ] Seed de categorias padrão ao criar household
- [ ] Instruções de como aplicar as migrations no painel do Supabase
- [ ] Commit: "Migrations, RLS e seed de categorias"

## Fase 3 — Auth + layout base
- [ ] Login (e-mail/senha) via Supabase Auth + "esqueci minha senha"
- [ ] Guard de sessão
- [ ] Layout raiz com barra inferior fixa (Novo / Dashboard / Lançamentos / Categorias)
- [ ] Dark mode via `prefers-color-scheme`
- [ ] Commit: "Auth e navegação base"

## Fase 4 — Novo Lançamento (tela principal)
- [ ] Teclado numérico grande, valor em destaque, toggle Entrada/Saída
- [ ] Grid de categorias tocáveis (emoji), data padrão = hoje, descrição opcional
- [ ] Switch "é futuro/pendente" → campo data prevista
- [ ] Server Action para gravar lançamento
- [ ] Commit: "Tela de novo lançamento"

## Fase 5 — Lançamentos (lista)
- [ ] Lista do mês, navegação entre meses, filtro por tipo/categoria
- [ ] Editar, excluir (com confirmação)
- [ ] "Marcar como pago" (pendente → realizado)
- [ ] Commit: "Tela de lançamentos"

## Fase 6 — Categorias e orçamentos
- [ ] CRUD de categorias (nome, cor, emoji)
- [ ] Orçamento mensal (apenas categorias de saída)
- [ ] Commit: "CRUD de categorias e orçamentos"

## Fase 7 — Dashboard
- [ ] Saldo do mês (entradas realizadas − saídas realizadas)
- [ ] Gráfico de barras (gasto vs. orçamento por categoria)
- [ ] Gráfico de pizza (distribuição de gastos)
- [ ] Card "Previsto" (pendentes a receber/pagar)
- [ ] Commit: "Dashboard e gráficos"

## Fase 8 — PWA + Deploy
- [ ] `manifest.json` + ícones
- [ ] Service worker
- [ ] Teste de instalação Android/iOS
- [ ] Deploy na Vercel (só com aviso/confirmação explícita do usuário)
- [ ] Commit: "PWA e configuração de deploy"
