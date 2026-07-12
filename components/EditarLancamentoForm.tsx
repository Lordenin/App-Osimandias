"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  atualizarLancamento,
  type EstadoEditarLancamento,
} from "@/app/(app)/lancamentos/actions";
import { formatarMoeda } from "@/lib/format";
import { GradeCategorias, type Categoria } from "@/components/GradeCategorias";

const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "⌫"];
const estadoInicial: EstadoEditarLancamento = {};

type Lancamento = {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
  descricao: string | null;
  categoria_id: string | null;
  data_competencia: string;
  status: "realizado" | "pendente";
  data_prevista: string | null;
};

export function EditarLancamentoForm({
  lancamento,
  categorias,
}: {
  lancamento: Lancamento;
  categorias: Categoria[];
}) {
  const router = useRouter();
  const acaoComId = atualizarLancamento.bind(null, lancamento.id);
  const [estado, acao, enviando] = useActionState(acaoComId, estadoInicial);

  const [tipo, setTipo] = useState<"entrada" | "saida">(lancamento.tipo);
  const [digitos, setDigitos] = useState(
    Math.round(lancamento.valor * 100).toString(),
  );
  const [categoriaId, setCategoriaId] = useState<string | null>(
    lancamento.categoria_id,
  );
  const [data, setData] = useState(lancamento.data_competencia);
  const [dataPrevista, setDataPrevista] = useState(
    lancamento.data_prevista ?? lancamento.data_competencia,
  );

  const pendente = lancamento.status === "pendente";
  const valorCentavos = digitos === "" ? 0 : parseInt(digitos, 10);
  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);

  function selecionarTipo(novoTipo: "entrada" | "saida") {
    setTipo(novoTipo);
    setCategoriaId(null);
  }

  function digitar(tecla: string) {
    if (tecla === "⌫") {
      setDigitos((prev) => prev.slice(0, -1));
      return;
    }
    setDigitos((prev) => (prev + tecla).replace(/^0+/, "").slice(0, 10));
  }

  return (
    <form action={acao} className="flex flex-1 flex-col gap-3 p-4">
      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="valorCentavos" value={valorCentavos} />
      <input type="hidden" name="categoriaId" value={categoriaId ?? ""} />
      <input type="hidden" name="pendente" value={pendente ? "true" : "false"} />
      <input type="hidden" name="dataPrevista" value={dataPrevista} />

      <div className="flex rounded-lg border border-neutral-300 p-1 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => selecionarTipo("saida")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            tipo === "saida"
              ? "bg-red-600 text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Saída
        </button>
        <button
          type="button"
          onClick={() => selecionarTipo("entrada")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            tipo === "entrada"
              ? "bg-green-600 text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Entrada
        </button>
      </div>

      <div className="py-1 text-center text-4xl font-bold tabular-nums">
        {formatarMoeda(valorCentavos / 100)}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TECLAS.map((tecla) => (
          <button
            key={tecla}
            type="button"
            onClick={() => digitar(tecla)}
            className="rounded-lg bg-neutral-100 py-3.5 text-lg font-medium active:bg-neutral-200 dark:bg-neutral-900 dark:active:bg-neutral-800"
          >
            {tecla}
          </button>
        ))}
      </div>

      <GradeCategorias
        categorias={categoriasFiltradas}
        categoriaId={categoriaId}
        onSelecionar={setCategoriaId}
      />

      <input
        type="text"
        name="descricao"
        defaultValue={lancamento.descricao ?? ""}
        placeholder="Descrição (opcional)"
        className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="data" className="text-sm font-medium">
          {pendente ? "Data prevista" : "Data"}
        </label>
        <input
          id="data"
          type="date"
          name="data"
          value={pendente ? dataPrevista : data}
          onChange={(e) =>
            pendente ? setDataPrevista(e.target.value) : setData(e.target.value)
          }
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
        />
      </div>

      {estado.erro && (
        <p className="text-sm text-red-600 dark:text-red-400">{estado.erro}</p>
      )}

      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/lancamentos")}
          className="flex-1 rounded-lg border border-neutral-300 py-3.5 text-base font-medium dark:border-neutral-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={enviando || valorCentavos === 0 || !categoriaId}
          className="flex-1 rounded-lg bg-neutral-900 py-3.5 text-base font-semibold text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {enviando ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
