@AGENTS.md

# Money Tracker — CLAUDE.md

App web instalável (PWA) para controle financeiro doméstico. Uso estritamente
pessoal (2 usuários, 1 household), sem intenção de virar produto. Prioridade
máxima: fricção zero ao lançar um gasto do dia a dia.

## Stack

- **Next.js (App Router, TypeScript)** — sem `src/`, alias `@/*` na raiz.
- **Tailwind CSS** para estilo.
- **Supabase** (Postgres + Auth + Row Level Security) — free tier.
- **Vercel** para deploy — free tier.
- **PWA**: manifest + service worker (Fase 8).
- **Recharts** para gráficos (Fase 7).
- Sem Redux/Zustand — só React state + Server Components/Server Actions.
- Não adicionar dependências fora dessa lista sem perguntar ao usuário antes.

## Comandos

```bash
npm install       # instalar dependências
npm run dev       # servidor de desenvolvimento (Turbopack)
npm run build     # build de produção
npm run start     # servir build de produção
npm run lint      # ESLint
```

## Convenções

- Idioma da interface: português do Brasil.
- Moeda: BRL, formatação pt-BR (`R$ 1.234,56`).
- Timezone de exibição: `America/Sao_Paulo`. Datas armazenadas em UTC no banco.
- "Mês vigente" = mês de calendário (1º ao último dia).
- Ícones de categoria: emoji (texto), sem biblioteca de ícones.
- Dark mode: automático via `prefers-color-scheme` (sem toggle manual).
- Mobile-first, testado em viewport de 390px. Barra de navegação inferior fixa
  com 4 itens: Novo, Dashboard, Lançamentos, Categorias.
- Sem testes automatizados nesta v1 (validação manual com o usuário).
- Uma fase do `PROGRESS.md` por vez; parar ao final de cada fase para validação
  do usuário; um commit por fase.

## Estrutura de pastas

```
app/                 # rotas (App Router)
components/          # componentes React reutilizáveis
lib/                 # helpers, cliente Supabase, formatação, etc.
supabase/migrations/ # migrations SQL versionadas
```

## Modelo de dados (Supabase / Postgres)

Todas as tabelas têm RLS habilitada: um usuário só enxerga/edita linhas cujo
`household_id` esteja entre os households em que ele é membro (via
`household_members`).

### `households`
- `id` (uuid, pk)
- `nome` (text)
- `created_at`

### `household_members`
- `household_id` (fk → households)
- `user_id` (fk → auth.users)
- pk composta (`household_id`, `user_id`)

### `categorias`
- `id` (uuid, pk)
- `household_id` (fk → households)
- `nome` (text)
- `tipo` (enum: `entrada` | `saida`)
- `cor` (text, hex)
- `icone` (text, emoji — opcional)
- `orcamento_mensal` (numeric, nullable — só usado quando `tipo = saida`)
- `ativa` (boolean, default true)

Seed automático ao criar household — ver Fase 2 no `PROGRESS.md` para a lista
completa de categorias padrão.

### `lancamentos`
- `id` (uuid, pk)
- `household_id` (fk → households)
- `criado_por` (fk → auth.users)
- `tipo` (enum: `entrada` | `saida`)
- `valor` (numeric(12,2), sempre positivo)
- `descricao` (text, nullable)
- `categoria_id` (fk → categorias, nullable)
- `data_competencia` (date) — data em que o valor conta para o mês
- `status` (enum: `realizado` | `pendente`)
- `data_prevista` (date, nullable) — usada quando `status = pendente`
- `created_at`, `updated_at`

Regras de negócio:
- Recebível futuro = `tipo = entrada` + `status = pendente` + `data_prevista`
  preenchida. Conta a pagar futura = mesmo esquema com `tipo = saida`.
- Ao marcar um pendente como pago: `status` vira `realizado` e
  `data_competencia` recebe a data efetiva.
- Saldo do mês considera apenas `status = realizado`. Pendentes aparecem em
  bloco separado ("Previsto").

## Variáveis de ambiente

Ver `.env.example`. Preencher em `.env.local` (não commitado):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Estado atual do projeto

Ver `PROGRESS.md` para o detalhamento das fases. Resumo:

- ✅ **Fase 1 — Setup**: projeto Next.js + TS + Tailwind criado, estrutura de
  pastas, `CLAUDE.md`, `PROGRESS.md`, `.env.example`. Build e lint limpos.
- ✅ **Fase 2 — Supabase**: migrations em `supabase/migrations/` (schema, RLS,
  seed de categorias). Instruções de aplicação em `supabase/README.md`.
  Ainda não aplicado no projeto Supabase real — depende do usuário criar o
  projeto e rodar os passos do README.
- ⬜ Fase 3 — Auth + layout base + navegação
- ⬜ Fase 4 — Tela de Novo Lançamento
- ⬜ Fase 5 — Tela de Lançamentos
- ⬜ Fase 6 — Categorias e orçamentos
- ⬜ Fase 7 — Dashboard e gráficos
- ⬜ Fase 8 — PWA + deploy na Vercel
