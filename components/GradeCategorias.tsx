export type Categoria = {
  id: string;
  nome: string;
  tipo: "entrada" | "saida";
  cor: string;
  icone: string | null;
};

export function GradeCategorias({
  categorias,
  categoriaId,
  onSelecionar,
}: {
  categorias: Categoria[];
  categoriaId: string | null;
  onSelecionar: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {categorias.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelecionar(c.id)}
          className="flex flex-col items-center gap-0.5 rounded-lg border-2 p-1.5 text-center"
          style={{
            borderColor: categoriaId === c.id ? c.cor : "transparent",
            backgroundColor:
              categoriaId === c.id ? `${c.cor}22` : "transparent",
          }}
        >
          <span className="text-lg leading-none">{c.icone ?? "🏷️"}</span>
          <span className="w-full truncate text-[10px] leading-tight text-neutral-600 dark:text-neutral-400">
            {c.nome}
          </span>
        </button>
      ))}
    </div>
  );
}
