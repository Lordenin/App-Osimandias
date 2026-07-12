# Money Tracker

Controle financeiro doméstico — app web instalável (PWA) para uso pessoal.

Veja `CLAUDE.md` para stack, comandos, convenções e modelo de dados, e
`PROGRESS.md` para o andamento por fases.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencher com as chaves do Supabase
npm run dev
```

## Instalar como app (PWA)

No celular, abra o site no navegador e use "Adicionar à tela de início"
(Android/Chrome) ou "Adicionar à Tela de Início" no menu de compartilhar
(iOS/Safari). O app abre em tela cheia, sem a barra do navegador.

## Deploy na Vercel

1. Em [vercel.com](https://vercel.com), faça login com GitHub e clique em
   **Add New > Project**.
2. Selecione o repositório `Lordenin/App-Osimandias`. O Framework Preset
   "Next.js" é detectado automaticamente — não precisa mudar nada.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**.
5. **Importante**: depois do primeiro deploy, copie a URL gerada (ex.:
   `https://money-tracker-xxxx.vercel.app`) e cadastre ela no painel do
   Supabase em **Authentication > URL Configuration > Redirect URLs**.
   Sem isso, o link de "esqueci minha senha" não funciona em produção
   (o Supabase recusa redirecionar para uma URL que não está na lista).
6. Deploys seguintes acontecem automaticamente a cada push na branch
   principal.
