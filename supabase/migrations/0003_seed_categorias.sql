-- Ao criar um household, insere automaticamente as categorias padrão.
-- security definer: garante que o seed funcione mesmo antes de o criador
-- do household constar em household_members (ordem de criação).

create or replace function seed_categorias_padrao()
returns trigger as $$
begin
  insert into categorias (household_id, nome, tipo, cor, icone) values
    (new.id, 'Mercado',      'saida',   '#ef4444', '🛒'),
    (new.id, 'Moradia',      'saida',   '#f97316', '🏠'),
    (new.id, 'Contas',       'saida',   '#eab308', '💡'),
    (new.id, 'Transporte',   'saida',   '#84cc16', '🚗'),
    (new.id, 'Saúde',        'saida',   '#22c55e', '💊'),
    (new.id, 'Educação',     'saida',   '#14b8a6', '📚'),
    (new.id, 'Lazer',        'saida',   '#06b6d4', '🎮'),
    (new.id, 'Restaurantes', 'saida',   '#3b82f6', '🍽️'),
    (new.id, 'Assinaturas',  'saida',   '#8b5cf6', '📱'),
    (new.id, 'Vestuário',    'saida',   '#d946ef', '👕'),
    (new.id, 'Pets',         'saida',   '#ec4899', '🐶'),
    (new.id, 'Outros',       'saida',   '#78716c', '📦'),
    (new.id, 'Salário',      'entrada', '#16a34a', '💰'),
    (new.id, 'Freela',       'entrada', '#0ea5e9', '💻'),
    (new.id, 'Reembolso',    'entrada', '#a855f7', '↩️'),
    (new.id, 'Rendimentos',  'entrada', '#f59e0b', '📈'),
    (new.id, 'Outros',       'entrada', '#64748b', '➕');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger households_seed_categorias
  after insert on households
  for each row
  execute function seed_categorias_padrao();
