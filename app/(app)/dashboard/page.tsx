import { createClient } from "@/lib/supabase/server";
import { mesAtualSaoPaulo, ultimoDiaDoMes } from "@/lib/data";
import { FiltroMesDashboard } from "@/components/FiltroMesDashboard";
import { CardSaldo } from "@/components/CardSaldo";
import { GraficoOrcamento, type ItemOrcamento } from "@/components/GraficoOrcamento";
import { GraficoDistribuicao, type FatiaDistribuicao } from "@/components/GraficoDistribuicao";
import { CardPrevisto, type Previsto } from "@/components/CardPrevisto";

type CategoriaEmbutida = { nome: string; icone: string | null; cor: string };

type LancamentoBruto = {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
  status: "realizado" | "pendente";
  categoria_id: string | null;
  descricao: string | null;
  data_prevista: string | null;
  categorias: CategoriaEmbutida | CategoriaEmbutida[] | null;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const params = await searchParams;
  const mes = params.mes ?? mesAtualSaoPaulo();

  const supabase = await createClient();

  const [{ data: lancamentos }, { data: categoriasSaida }] = await Promise.all([
    supabase
      .from("lancamentos")
      .select(
        "id, tipo, valor, status, categoria_id, descricao, data_prevista, categorias(nome, icone, cor)",
      )
      .gte("data_competencia", `${mes}-01`)
      .lte("data_competencia", ultimoDiaDoMes(mes)),
    supabase
      .from("categorias")
      .select("id, nome, icone, orcamento_mensal")
      .eq("tipo", "saida")
      .eq("ativa", true)
      .not("orcamento_mensal", "is", null)
      .order("nome"),
  ]);

  const todos = ((lancamentos as LancamentoBruto[] | null) ?? []).map((l) => ({
    ...l,
    categorias: Array.isArray(l.categorias) ? (l.categorias[0] ?? null) : l.categorias,
  }));

  const realizados = todos.filter((l) => l.status === "realizado");
  const pendentes: Previsto[] = todos.filter((l) => l.status === "pendente");

  const entradas = realizados
    .filter((l) => l.tipo === "entrada")
    .reduce((soma, l) => soma + l.valor, 0);
  const saidas = realizados
    .filter((l) => l.tipo === "saida")
    .reduce((soma, l) => soma + l.valor, 0);

  const gastoPorCategoria = new Map<string, number>();
  const distribuicaoPorChave = new Map<string, FatiaDistribuicao>();

  for (const l of realizados) {
    if (l.tipo !== "saida") continue;

    if (l.categoria_id) {
      gastoPorCategoria.set(
        l.categoria_id,
        (gastoPorCategoria.get(l.categoria_id) ?? 0) + l.valor,
      );
    }

    const chave = l.categoria_id ?? "sem-categoria";
    const existente = distribuicaoPorChave.get(chave);
    if (existente) {
      existente.valor += l.valor;
    } else {
      distribuicaoPorChave.set(chave, {
        id: chave,
        nome: l.categorias?.nome ?? "Sem categoria",
        icone: l.categorias?.icone ?? "🏷️",
        cor: l.categorias?.cor ?? "#898781",
        valor: l.valor,
      });
    }
  }

  const itensOrcamento: ItemOrcamento[] = (categoriasSaida ?? []).map((c) => ({
    id: c.id,
    nome: c.nome,
    icone: c.icone,
    gasto: gastoPorCategoria.get(c.id) ?? 0,
    orcamento: c.orcamento_mensal ?? 0,
  }));

  const fatiasDistribuicao = Array.from(distribuicaoPorChave.values());

  return (
    <div className="flex flex-1 flex-col gap-5 p-4">
      <FiltroMesDashboard mes={mes} />

      <CardSaldo entradas={entradas} saidas={saidas} />

      <section>
        <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Gasto vs. orçamento
        </h2>
        <GraficoOrcamento itens={itensOrcamento} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Distribuição de gastos
        </h2>
        <GraficoDistribuicao itens={fatiasDistribuicao} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Previsto
        </h2>
        <CardPrevisto pendentes={pendentes} />
      </section>
    </div>
  );
}
