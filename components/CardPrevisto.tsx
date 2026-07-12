import { formatarMoeda } from "@/lib/format";

export type Previsto = {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
  descricao: string | null;
  data_prevista: string | null;
  categorias: { nome: string; icone: string | null } | null;
};

function formatarDataCurta(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

export function CardPrevisto({ pendentes }: { pendentes: Previsto[] }) {
  if (pendentes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Nada previsto para este mês.
      </p>
    );
  }

  const aReceber = pendentes.filter((p) => p.tipo === "entrada");
  const aPagar = pendentes.filter((p) => p.tipo === "saida");
  const totalReceber = aReceber.reduce((s, p) => s + p.valor, 0);
  const totalPagar = aPagar.reduce((s, p) => s + p.valor, 0);

  return (
    <div className="flex flex-col gap-4">
      {aReceber.length > 0 && (
        <GrupoPrevisto
          titulo="A receber"
          total={totalReceber}
          corTotal="text-green-600 dark:text-green-400"
          itens={aReceber}
        />
      )}
      {aPagar.length > 0 && (
        <GrupoPrevisto
          titulo="A pagar"
          total={totalPagar}
          corTotal="text-red-600 dark:text-red-400"
          itens={aPagar}
        />
      )}
    </div>
  );
}

function GrupoPrevisto({
  titulo,
  total,
  corTotal,
  itens,
}: {
  titulo: string;
  total: number;
  corTotal: string;
  itens: Previsto[];
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-medium">
        <span>{titulo}</span>
        <span className={corTotal}>{formatarMoeda(total)}</span>
      </div>
      <ul className="flex flex-col gap-1">
        {itens.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-1.5 truncate text-neutral-700 dark:text-neutral-300">
              <span>{p.categorias?.icone ?? "🏷️"}</span>
              <span className="truncate">
                {p.descricao || p.categorias?.nome || "Sem categoria"}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="tabular-nums text-neutral-500 dark:text-neutral-400">
                {formatarMoeda(p.valor)}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {p.data_prevista ? formatarDataCurta(p.data_prevista) : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
