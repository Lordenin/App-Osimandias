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
- [x] Lista do mês, navegação entre meses, filtro por tipo/categoria
- [x] Editar, excluir (com confirmação)
- [x] "Marcar como pago" (pendente → realizado)
- [x] Commit: "Tela de lançamentos"
- [ ] **Pendente do usuário**: validar contra o Supabase real (a consulta usa
      `categorias(nome, icone, cor)` embutido via FK — confirmar que volta
      certo com dados de verdade)

## Fase 6 — Categorias e orçamentos
- [x] CRUD de categorias (nome, cor, emoji)
- [x] Orçamento mensal (apenas categorias de saída)
- [x] Commit: "CRUD de categorias e orçamentos"
- [ ] **Pendente do usuário**: validar contra o Supabase real

## Fase 7 — Dashboard
- [x] Saldo do mês (entradas realizadas − saídas realizadas)
- [x] Gráfico de barras (gasto vs. orçamento por categoria)
- [x] Gráfico de pizza (distribuição de gastos)
- [x] Card "Previsto" (pendentes a receber/pagar)
- [x] Commit: "Dashboard e gráficos"
- [ ] **Pendente do usuário**: validar contra o Supabase real

## Fase 8 — PWA + Deploy
- [x] `manifest.ts` + ícones (192/512/maskable, apple-icon, favicon)
- [x] Service worker (`public/sw.js`, registrado em `RegistrarServiceWorker`)
- [ ] **Pendente do usuário**: testar a instalação de verdade no
      Android/iOS (precisa do app rodando em HTTPS ou localhost)
- [ ] **Pendente do usuário**: Deploy na Vercel — passo a passo no
      `README.md`; só faço/confirmo com aviso explícito seu
- [ ] Commit: "PWA e configuração de deploy"
