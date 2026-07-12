-- Extensão necessária para gen_random_uuid()
create extension if not exists pgcrypto;

-- Enums
create type tipo_lancamento as enum ('entrada', 'saida');
create type status_lancamento as enum ('realizado', 'pendente');

-- Households (a "casa" — um único household compartilhado pelos dois usuários)
create table households (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

-- Membros do household
create table household_members (
  household_id uuid not null references households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create index household_members_user_idx on household_members (user_id);

-- Categorias (entrada ou saída, com cor e ícone/emoji)
create table categorias (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  nome text not null,
  tipo tipo_lancamento not null,
  cor text not null,
  icone text,
  orcamento_mensal numeric(12, 2),
  ativa boolean not null default true,
  created_at timestamptz not null default now(),
  constraint orcamento_apenas_saida check (
    orcamento_mensal is null or tipo = 'saida'
  )
);

create index categorias_household_idx on categorias (household_id);

-- Lançamentos (entradas, saídas, recebíveis e contas futuras)
create table lancamentos (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  criado_por uuid not null references auth.users(id),
  tipo tipo_lancamento not null,
  valor numeric(12, 2) not null check (valor > 0),
  descricao text,
  categoria_id uuid references categorias(id) on delete set null,
  data_competencia date not null,
  status status_lancamento not null default 'realizado',
  data_prevista date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint data_prevista_quando_pendente check (
    status = 'realizado' or data_prevista is not null
  )
);

create index lancamentos_household_data_idx on lancamentos (household_id, data_competencia);
create index lancamentos_household_status_idx on lancamentos (household_id, status);

-- Mantém updated_at em dia automaticamente
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger lancamentos_set_updated_at
  before update on lancamentos
  for each row
  execute function set_updated_at();
