"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
export type ItemOrcamento = {
  id: string;
  nome: string;
  icone: string | null;
  gasto: number;
  orcamento: number;
};

// Paleta de status (fixa, nunca segue a cor da categoria — aqui a cor
// comunica "dentro/perto/estourou o orçamento", não identidade).
const COR_BOM = "#0ca30c";
const COR_ATENCAO = "#fab219";
const COR_ESTOURADO = "#d03b3b";

// Versão compacta (sem espaços, cai o "00" quando é redondo) — o rótulo
// vai fora da barra, no espaço apertado da margem direita em 390px.
function formatarMoedaCompacta(valor: number): string {
  const temCentavos = !Number.isInteger(valor);
  return `R$${valor.toLocaleString("pt-BR", {
    minimumFractionDigits: temCentavos ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

function corSeveridade(gasto: number, orcamento: number): string {
  if (orcamento <= 0) return COR_BOM;
  const pct = gasto / orcamento;
  if (pct >= 1) return COR_ESTOURADO;
  if (pct >= 0.8) return COR_ATENCAO;
  return COR_BOM;
}

export function GraficoOrcamento({ itens }: { itens: ItemOrcamento[] }) {
  if (itens.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Nenhuma categoria de saída com orçamento definido.
      </p>
    );
  }

  const dados = itens.map((i) => ({
    ...i,
    rotulo: `${i.icone ?? "🏷️"} ${i.nome}`,
    textoValor: `${formatarMoedaCompacta(i.gasto)}/${formatarMoedaCompacta(i.orcamento)}`,
  }));

  return (
    <div>
      <div
        className="text-neutral-600 dark:text-neutral-400"
        style={{ width: "100%", height: dados.length * 40 + 16 }}
      >
        <ResponsiveContainer>
          <BarChart
            data={dados}
            layout="vertical"
            margin={{ left: 4, right: 88, top: 4, bottom: 4 }}
          >
            <XAxis type="number" hide domain={[0, (max: number) => max * 1.1]} />
            <YAxis
              type="category"
              dataKey="rotulo"
              width={88}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
            />
            <Bar dataKey="gasto" radius={4} barSize={14} isAnimationActive={false}>
              {dados.map((d) => (
                <Cell key={d.id} fill={corSeveridade(d.gasto, d.orcamento)} />
              ))}
              <LabelList
                dataKey="textoValor"
                position="right"
                style={{ fontSize: 10, fill: "currentColor" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
        <LegendaStatus cor={COR_BOM} texto="Dentro do orçamento" />
        <LegendaStatus cor={COR_ATENCAO} texto="Perto do limite" />
        <LegendaStatus cor={COR_ESTOURADO} texto="Estourou" />
      </div>
    </div>
  );
}

function LegendaStatus({ cor, texto }: { cor: string; texto: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cor }} />
      {texto}
    </span>
  );
}
