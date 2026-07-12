"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatarMoeda } from "@/lib/format";

export type FatiaDistribuicao = {
  id: string;
  nome: string;
  icone: string | null;
  cor: string;
  valor: number;
};

const COR_OUTROS = "#898781";

export function GraficoDistribuicao({ itens }: { itens: FatiaDistribuicao[] }) {
  if (itens.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Nenhum gasto neste mês.
      </p>
    );
  }

  const ordenados = [...itens].sort((a, b) => b.valor - a.valor);
  const principais = ordenados.slice(0, 5);
  const resto = ordenados.slice(5);
  const somaResto = resto.reduce((s, i) => s + i.valor, 0);

  const dados =
    somaResto > 0
      ? [
          ...principais,
          { id: "outros", nome: "Outros", icone: "➕", cor: COR_OUTROS, valor: somaResto },
        ]
      : principais;

  const total = dados.reduce((s, i) => s + i.valor, 0);

  return (
    <div>
      <div className="relative" style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dados}
              dataKey="valor"
              nameKey="nome"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {dados.map((d) => (
                <Cell
                  key={d.id}
                  fill={d.cor}
                  style={{ stroke: "var(--chart-surface)", strokeWidth: 2 }}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Total</span>
          <span className="text-lg font-semibold">{formatarMoeda(total)}</span>
        </div>
      </div>

      <ul className="mt-2 flex flex-col gap-1 text-xs">
        {dados.map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.cor }}
              />
              <span className="truncate">
                {d.icone} {d.nome}
              </span>
            </span>
            <span className="shrink-0 tabular-nums text-neutral-500 dark:text-neutral-400">
              {formatarMoeda(d.valor)} · {Math.round((d.valor / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
