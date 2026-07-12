import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListaCategorias } from "@/components/ListaCategorias";
import { SeletorTipoCategoria } from "@/components/SeletorTipoCategoria";

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const tipo = params.tipo === "entrada" ? "entrada" : "saida";

  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nome, tipo, cor, icone, ativa, orcamento_mensal")
    .eq("tipo", tipo)
    .order("nome");

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <SeletorTipoCategoria tipo={tipo} />
        <Link
          href={`/categorias/nova?tipo=${tipo}`}
          className="shrink-0 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          + Nova
        </Link>
      </div>

      <ListaCategorias categorias={categorias ?? []} />
    </div>
  );
}
