# Supabase — como aplicar

## 1. Criar o projeto

Crie um projeto no [supabase.com](https://supabase.com) (free tier). Anote a
região mais próxima do Brasil, se disponível.

## 2. Aplicar as migrations

Mais simples: **SQL Editor** do painel Supabase (Project > SQL Editor > New
query). Cole e rode, **nesta ordem**, o conteúdo de cada arquivo em
`supabase/migrations/`:

1. `0001_schema.sql` — tabelas, enums, índices
2. `0002_rls.sql` — Row Level Security (RLS) e políticas
3. `0003_seed_categorias.sql` — seed automático de categorias ao criar household

(Alternativa: se preferir, dá pra usar a [Supabase CLI](https://supabase.com/docs/guides/cli)
com `supabase db push`, mas para dois usuários o SQL Editor já resolve sem
precisar instalar nada.)

## 3. Criar os dois usuários

No painel: **Authentication > Users > Add user**. Crie um usuário para você e
um para sua esposa (e-mail + senha). Não há cadastro público no app — os
usuários só existem porque foram criados aqui.

Depois de criados, copie o **UUID** de cada usuário (aparece na lista de
Users, coluna `UID`).

## 4. Criar o household e vincular os dois usuários

Ainda no SQL Editor, rode (substituindo os UUIDs pelos que você copiou):

```sql
-- 1. cria o household (isso já dispara o seed de categorias automaticamente)
insert into households (nome) values ('Nossa Casa')
returning id;

-- 2. copie o "id" retornado acima e use no lugar de <HOUSEHOLD_ID> abaixo
insert into household_members (household_id, user_id) values
  ('<HOUSEHOLD_ID>', '<UUID_USUARIO_1>'),
  ('<HOUSEHOLD_ID>', '<UUID_USUARIO_2>');
```

Rodando pelo SQL Editor você está autenticado como `postgres`, que ignora RLS
— por isso esse bootstrap inicial funciona mesmo sem nenhum membro cadastrado
ainda. Depois disso, o app (autenticado como usuário normal) só consegue
enxergar o que o RLS permitir.

## 5. Conferir

- `select * from categorias;` deve trazer as 17 categorias padrão já com o
  `household_id` correto.
- `select * from household_members;` deve trazer as duas linhas.

## 6. Variáveis de ambiente do app

Em **Project Settings > API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Cole em `.env.local` (veja `.env.example` na raiz do projeto).

## 7. Testar o RLS (importante)

Para confirmar que um usuário sem vínculo não vê nada: crie um terceiro
usuário de teste em Authentication > Users, **sem** inserir ele em
`household_members`, faça login com ele no app (quando a Fase 3 estiver
pronta) e confirme que nenhum lançamento/categoria aparece.
