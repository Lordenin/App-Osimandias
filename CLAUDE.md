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
- **Recharts** para gráficos.
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
- Ícones do **app** (favicon/PWA) são gerados via `next/og`, mas usam um
  monograma "M" desenhado (não emoji): o `ImageResponse` renderiza emoji
  buscando SVGs do Twemoji numa CDN externa, uma dependência de rede
  frágil demais pra algo essencial como o ícone do app.
- Dark mode: automático via `prefers-color-scheme` (sem toggle manual).
- Mobile-first, testado em viewport de 390px. Barra de navegação inferior fixa
  com 4 itens: Novo, Dashboard, Lançamentos, Categorias.
- Sem testes automatizados nesta v1 (validação manual com o usuário).
- Uma fase do `PROGRESS.md` por vez; parar ao final de cada fase para validação
  do usuário; um commit por fase.

## Estrutura de pastas

```
app/
  (app)/              # rotas autenticadas: layout com header + bottom nav
    page.tsx           # Novo lançamento (Fase 4)
    actions.ts          # Server Actions: sair, criarLancamento
    dashboard/          # saldo, gráficos (Recharts) e "Previsto"
    lancamentos/         # lista, filtros, editar, excluir, marcar como pago
      actions.ts          # Server Actions: excluir, marcarComoPago, atualizar
      [id]/editar/          # tela de edição
    categorias/           # CRUD e orçamentos
      actions.ts            # Server Actions: criar, atualizar, excluir
      nova/                  # criar categoria
      [id]/editar/            # editar categoria
  login/               # tela de login + "esqueci minha senha"
  atualizar-senha/     # definir nova senha (fluxo de recuperação)
  auth/callback/        # troca o "code" do e-mail por sessão (Supabase)
  manifest.ts           # Web App Manifest (PWA)
  icon.tsx              # favicon 32x32 (monograma "M", gerado via next/og)
  apple-icon.tsx         # ícone 180x180 pro iOS
  icon-192/, icon-512/    # ícones do manifest (any + maskable)
components/            # componentes React reutilizáveis (ex: BottomNav)
lib/format.ts           # formatarMoeda() — sempre usar pra exibir valores em R$
lib/data.ts             # hojeSaoPaulo() — "hoje" no fuso America/Sao_Paulo
lib/supabase/           # clientes Supabase (browser, server, proxy)
supabase/migrations/    # migrations SQL versionadas
public/sw.js             # service worker mínimo (sem cache de dados/HTML)
proxy.ts                # substitui "middleware.ts" no Next 16; protege rotas
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
- ✅ **Fase 3 — Auth + layout base**: login (e-mail/senha) e recuperação de
  senha via Supabase Auth, `proxy.ts` protegendo rotas (redireciona para
  `/login` sem sessão), layout `(app)` com header + botão sair + bottom nav
  fixa (Novo/Dashboard/Lançamentos/Categorias).
  Requer `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` reais em
  `.env.local` para funcionar (sem eles a app derruba a request de propósito).
- ✅ **Fase 4 — Novo Lançamento**: `app/(app)/page.tsx` busca as categorias do
  household (Server Component) e passa para `components/NovoLancamentoForm.tsx`
  (Client Component): teclado numérico estilo calculadora (dígitos formam
  centavos), toggle Entrada/Saída, grid de categorias filtrada por tipo,
  descrição opcional, switch "é futuro/pendente" revelando a data prevista.
  Server Action `criarLancamento` em `app/(app)/actions.ts` grava no Supabase
  e o formulário reseta (via remount por `key`) após salvar com sucesso.
- ✅ **Fase 5 — Tela de Lançamentos**: `app/(app)/lancamentos/page.tsx` lê
  `mes`/`tipo`/`categoria` da URL (`searchParams`), busca no Supabase com a
  categoria embutida via FK e navegação/filtro feitos por
  `components/FiltrosLancamentos.tsx` (Client, atualiza a URL). Cada
  lançamento é um card em `components/ListaLancamentos.tsx` com excluir
  (confirmação nativa do navegador) e, se pendente, "marcar como pago".
  Editar abre `/lancamentos/[id]/editar`, que reaproveita `GradeCategorias`
  (extraído do formulário de novo lançamento) num formulário pré-preenchido.
  Server Actions em `app/(app)/lancamentos/actions.ts`.
- ✅ **Fase 6 — Categorias e orçamentos**: `app/(app)/categorias/page.tsx` lista
  por tipo (`?tipo=saida|entrada`, seletor em `SeletorTipoCategoria`), cada
  categoria num card (`ListaCategorias`) com cor, emoji, orçamento (se
  saída) e badge "Inativa". Criar (`/categorias/nova`) e editar
  (`/categorias/[id]/editar`) usam o mesmo `CategoriaForm` (nome, emoji,
  `<input type="color">` pra cor, orçamento mensal só aparece com tipo
  saída, checkbox "ativa" pra desativar sem perder o histórico). Server
  Actions em `app/(app)/categorias/actions.ts`.
- ✅ **Fase 7 — Dashboard**: `app/(app)/dashboard/page.tsx` busca lançamentos do
  mês (`?mes=`, navegação via `FiltroMesDashboard`/`SeletorMes`, compartilhado
  com Lançamentos) e categorias de saída com orçamento definido. `CardSaldo`
  mostra o saldo (entradas − saídas realizadas) como número em destaque.
  `GraficoOrcamento` (Recharts, barras horizontais) compara gasto x orçamento
  por categoria com cor por severidade (verde/âmbar/vermelho — status, não
  identidade da categoria). `GraficoDistribuicao` (Recharts, rosca) usa a cor
  própria de cada categoria (consistente com o resto do app), com legenda e
  total no centro; categorias além da 5ª somam em "Outros" pra não estourar
  o limite de fatias legíveis. `CardPrevisto` lista pendentes agrupados em "A
  receber"/"A pagar". Sem Server Actions nesta fase (só leitura).
- ✅ **Fase 8 — PWA**: `app/manifest.ts` (ícones 192/512 em `any`+`maskable`,
  `display: standalone`, tema escuro). Ícones gerados via `next/og`
  (`icon.tsx`, `apple-icon.tsx`, `icon-192/`, `icon-512/`) com monograma
  "M" — ver nota em Convenções sobre por que não é emoji.
  `public/sw.js` é um service worker mínimo (registrado por
  `RegistrarServiceWorker` no layout raiz): só cacheia o manifest e cai
  pro cache somente se a rede falhar de verdade — nunca cacheia HTML/dados,
  porque saldo desatualizado seria pior que não funcionar offline. Deploy
  na Vercel ainda não feito — passo a passo no `README.md`, só executo
  com aviso/confirmação explícita sua.
