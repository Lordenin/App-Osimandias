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
- [x] Migrations SQL: `households`, `household_members`, `categorias`, `lancamentos`, enums
- [x] RLS em todas as tabelas (select/insert/update/delete explícitas)
- [x] Seed de categorias padrão ao criar household
- [x] Instruções de como aplicar as migrations no painel do Supabase (`supabase/README.md`)
- [x] Commit: "Migrations, RLS e seed de categorias"
- [ ] **Pendente do usuário**: aplicar as migrations no projeto Supabase real e confirmar

## Fase 3 — Auth + layout base
- [x] Login (e-mail/senha) via Supabase Auth + "esqueci minha senha"
- [x] Guard de sessão (`proxy.ts`, redireciona para `/login` sem sessão)
- [x] Layout raiz com barra inferior fixa (Novo / Dashboard / Lançamentos / Categorias)
- [x] Dark mode via `prefers-color-scheme`
- [x] Commit: "Auth e navegação base"
- [ ] **Pendente do usuário**: preencher `.env.local` com as chaves reais do
      Supabase (Fase 2) e validar o login com os dois usuários de verdade

## Fase 4 — Novo Lançamento (tela principal)
- [x] Teclado numérico grande, valor em destaque, toggle Entrada/Saída
- [x] Grid de categorias tocáveis (emoji), data padrão = hoje, descrição opcional
- [x] Switch "é futuro/pendente" → campo data prevista
- [x] Server Action para gravar lançamento
- [x] Commit: "Tela de novo lançamento"
- [ ] **Pendente do usuário**: validar o salvamento de verdade contra o
      Supabase real (Fases 2 e 3 precisam estar aplicadas com `.env.local`)

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
