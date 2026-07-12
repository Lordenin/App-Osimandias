import { createClient } from "@/lib/supabase/server";
import { mesAtualSaoPaulo, ultimoDiaDoMes } from "@/lib/data";
import { FiltrosLancamentos } from "@/components/FiltrosLancamentos";
import { ListaLancamentos, type Lancamento } from "@/components/ListaLancamentos";

export default async function LancamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; tipo?: string; categoria?: string }>;
}) {
  const params = await searchParams;
  const mes = params.mes ?? mesAtualSaoPaulo();
  const tipo = params.tipo === "entrada" || params.tipo === "saida" ? params.tipo : "todos";
  const categoriaId = params.categoria ?? "";

  const supabase = await createClient();

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nome, tipo, cor, icone")
    .order("nome");

  let query = supabase
    .from("lancamentos")
    .select(
      "id, tipo, valor, descricao, categoria_id, data_competencia, status, data_prevista, categorias(nome, icone, cor)",
    )
    .gte("data_competencia", `${mes}-01`)
    .lte("data_competencia", ultimoDiaDoMes(mes))
    .order("data_competencia", { ascending: false })
    .order("created_at", { ascending: false });

  if (tipo !== "todos") {
    query = query.eq("tipo", tipo);
  }
  if (categoriaId) {
    query = query.eq("categoria_id", categoriaId);
  }

  const { data: lancamentos } = await query;

  // O PostgREST embeda a categoria como objeto único (é uma FK to-one), mas
  // normalizamos aqui caso volte como array, pra não depender desse detalhe.
  const normalizados: Lancamento[] = (lancamentos ?? []).map((l) => {
    const cat = l.categorias as Lancamento["categorias"] | Lancamento["categorias"][];
    return { ...l, categorias: Array.isArray(cat) ? (cat[0] ?? null) : cat };
  });

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <FiltrosLancamentos mes={mes} tipo={tipo} categorias={categorias ?? []} categoriaId={categoriaId} />
      <ListaLancamentos lancamentos={normalizados} />
    </div>
  );
}
