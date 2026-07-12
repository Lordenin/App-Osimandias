-- Row Level Security: um usuário só enxerga/edita linhas de households
-- em que ele é membro (household_members).

alter table households enable row level security;
alter table household_members enable row level security;
alter table categorias enable row level security;
alter table lancamentos enable row level security;

-- Helper: precisa ser security definer para não causar recursão infinita
-- quando a própria policy de household_members consultaria household_members.
create or replace function is_household_member(target_household_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from household_members
    where household_id = target_household_id
      and user_id = auth.uid()
  );
$$;

-- households --------------------------------------------------------------

create policy households_select on households
  for select
  using (is_household_member(id));

create policy households_insert on households
  for insert
  to authenticated
  with check (true);

create policy households_update on households
  for update
  using (is_household_member(id));

create policy households_delete on households
  for delete
  using (is_household_member(id));

-- household_members ---------------------------------------------------------

create policy household_members_select on household_members
  for select
  using (is_household_member(household_id));

create policy household_members_insert on household_members
  for insert
  to authenticated
  with check (is_household_member(household_id));

create policy household_members_update on household_members
  for update
  using (is_household_member(household_id));

create policy household_members_delete on household_members
  for delete
  using (is_household_member(household_id));

-- categorias ----------------------------------------------------------------

create policy categorias_select on categorias
  for select
  using (is_household_member(household_id));

create policy categorias_insert on categorias
  for insert
  to authenticated
  with check (is_household_member(household_id));

create policy categorias_update on categorias
  for update
  using (is_household_member(household_id));

create policy categorias_delete on categorias
  for delete
  using (is_household_member(household_id));

-- lancamentos -----------------------------------------------------------------

create policy lancamentos_select on lancamentos
  for select
  using (is_household_member(household_id));

create policy lancamentos_insert on lancamentos
  for insert
  to authenticated
  with check (
    is_household_member(household_id)
    and criado_por = auth.uid()
  );

create policy lancamentos_update on lancamentos
  for update
  using (is_household_member(household_id));

create policy lancamentos_delete on lancamentos
  for delete
  using (is_household_member(household_id));
